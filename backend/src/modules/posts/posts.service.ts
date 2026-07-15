import mongoose, { QueryFilter, Types } from "mongoose";
import { IPaginationOptions } from "@/interfaces/pagination.interfaces";
import { S3Service } from "../aws/s3.service";
import { MediaOwnerType } from "../media/media.interface";
import { MediaService } from "../media/media.service";
import { FeedPostDto, IPost, Visibility } from "./posts.interface";
import { PostModel } from "./posts.model";
import { LikesService } from "../likes/likes.service";
import { LikeTargetType } from "../likes/likes.interface";
import { sanitizePostContent } from "@/utils/sanitize";
import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "@/lib/httpStatus";
import { calculatePageSize } from "@/utils/calculatePageSize";
import { CommentModel } from "../comments/comments.model";
import { LikeModel } from "../likes/likes.model";
import { ReplyModel } from "../replies/replies.model";

class Service {
  async create(data: IPost, file?: Express.Multer.File) {
    if (typeof data.content === "string" && data.content.trim()) {
      if (data.content.length > 5000) {
        throw new ApiError(
          HttpStatusCode.BAD_REQUEST,
          "Post content cannot exceed 5000 characters."
        );
      }
      // Currently, we don't allow Rich Text (HTML) as content. It maybe allow in future
      data.content = sanitizePostContent(data.content);
    }

    const post = await PostModel.create(data);

    if (file) {
      const upload = await S3Service.uploadSingleFile(file, "posts/images");

      const media = await MediaService.create({
        ...upload,
        uploaded_by: data.author_id,
        owner_id: post._id,
        owner_type: MediaOwnerType.POST,
      });

      post.image_id = media._id;

      await post.save();
    }

    return {
      id: post._id,
    };
  }

  async getFeedPosts(options: IPaginationOptions, userId: Types.ObjectId) {
    const {
      limit = 10,
      cursor,
      sort_by = "_id",
      sort_order = "desc",
    } = options;

    const safeLimit = calculatePageSize(limit);

    const filter: QueryFilter<IPost> = {
      visibility: Visibility.PUBLIC,
      deleted_at: null,
    };

    if (cursor) {
      filter._id = {
        $lt: new Types.ObjectId(cursor),
      };
    }

    const posts = await PostModel.find(filter)
      .sort({
        [sort_by]: sort_order === "asc" ? 1 : -1,
      })
      .limit(safeLimit)
      .populate({
        path: "author_id",
        select: "first_name last_name avatar_id",
        populate: {
          path: "avatar_id",
          select: "url",
        },
      })
      .populate({
        path: "image_id",
        select: "url width height mime_type",
      })
      .lean();

    if (!posts.length) {
      return {
        meta: {
          page_size: safeLimit,
          next_cursor: null,
          has_more: false,
        },
        posts: [],
      };
    }

    const nextCursor =
      posts.length === safeLimit
        ? posts[posts.length - 1]._id.toString()
        : null;

    const postsDto = posts.map(this.toFeedPostDto);
    const postIds = posts.map((post) => post._id);
    const currentUserLikes = await LikesService.getLikesByUserForTargets(
      userId,
      LikeTargetType.POST,
      postIds
    );

    const likedPostIds = new Set(
      currentUserLikes.map((like) => like.target_id.toString())
    );

    return {
      meta: {
        page_size: safeLimit,
        post_count: postsDto.length,
        next_cursor: nextCursor,
        has_more: !!nextCursor,
      },
      posts: postsDto.map((post) => ({
        ...post,
        is_liked: likedPostIds.has(post.id.toString()),
        is_owner: userId.toString() === post.author.id.toString(),
      })),
    };
  }

  async updatePost(
    id: Types.ObjectId,
    authorId: Types.ObjectId,
    content: string
  ) {
    if (typeof content === "string" && content.trim()) {
      if (content.length > 5000) {
        throw new ApiError(
          HttpStatusCode.BAD_REQUEST,
          "Post content cannot exceed 5000 characters."
        );
      }
      content = sanitizePostContent(content);
    } else {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "Post content is required"
      );
    }

    const result = await PostModel.findOneAndUpdate(
      {
        _id: id,
        author_id: authorId,
      },
      {
        $set: { content },
      }
    );

    if (!result) {
      throw new ApiError(
        HttpStatusCode.NOT_FOUND,
        "Post was not found or you are not owner of the post"
      );
    }
  }

  // ======== Note ========
  /*
    Right now, I intentionally performing all the operation at once with MongoDB ACID Operation
    But, for a production application, I always prefer to use background job to perform cascading deletion for very large dataset
  */
  async delete(id: Types.ObjectId, authorId: Types.ObjectId) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const post = await PostModel.findOne({
        _id: id,
        author_id: authorId,
      }).session(session);

      if (!post) {
        throw new ApiError(
          HttpStatusCode.NOT_FOUND,
          "Post was not found or you are not authorized to perform this action."
        );
      }

      const comments = await CommentModel.find(
        { post_id: post._id },
        { _id: 1 }
      ).session(session);

      const commentIds = comments.map((c) => c._id);

      let replyIds: Types.ObjectId[] = [];

      if (commentIds.length) {
        const replies = await ReplyModel.find(
          {
            comment_id: { $in: commentIds },
          },
          { _id: 1 }
        ).session(session);

        replyIds = replies.map((r) => r._id);
      }

      const deleteOperations: Promise<unknown>[] = [];

      if (replyIds.length) {
        deleteOperations.push(
          LikeModel.deleteMany(
            {
              target_id: { $in: replyIds },
              target_type: LikeTargetType.REPLY,
            },
            { session }
          )
        );
      }

      if (commentIds.length) {
        deleteOperations.push(
          ReplyModel.deleteMany(
            {
              comment_id: { $in: commentIds },
            },
            { session }
          ),

          LikeModel.deleteMany(
            {
              target_id: { $in: commentIds },
              target_type: LikeTargetType.COMMENT,
            },
            { session }
          ),

          CommentModel.deleteMany(
            {
              post_id: post._id,
            },
            { session }
          )
        );
      }

      deleteOperations.push(
        LikeModel.deleteMany(
          {
            target_id: post._id,
            target_type: LikeTargetType.POST,
          },
          { session }
        )
      );

      await Promise.all(deleteOperations);

      // Delete the media as well
      if (post.image_id) {
        await MediaService.delete(
          post.image_id as Types.ObjectId,
          MediaOwnerType.POST,
          session
        );
      }

      await post.deleteOne({ session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();

      if (error instanceof ApiError) {
        throw error;
      }

      console.error(error);

      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to delete post. Please try again!"
      );
    } finally {
      await session.endSession();
    }
  }

  private toFeedPostDto(post: any): FeedPostDto {
    return {
      id: post._id.toString(),

      content: post.content,

      created_at: post.created_at,

      like_count: post.like_count,

      comment_count: post.comment_count,

      author: {
        id: post.author_id._id.toString(),

        name: `${post.author_id.first_name} ${post.author_id.last_name}`,

        avatar_url: post.author_id?.avatar_id?.url,
      },

      image: post.image_id
        ? {
            url: post.image_id?.url,
            width: post.image_id?.width,
            height: post.image_id?.height,
          }
        : null,
    };
  }
}

export const PostsService = new Service();
