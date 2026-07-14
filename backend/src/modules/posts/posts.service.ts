import { QueryFilter, Types } from "mongoose";
import { IPaginationOptions } from "@/interfaces/pagination.interfaces";
import { AWSFileUploader } from "../aws/uploader";
import { MediaOwnerType } from "../media/media.interface";
import { MediaService } from "../media/media.service";
import { FeedPostDto, IPost, Visibility } from "./posts.interface";
import { PostModel } from "./posts.model";
import { LikesService } from "../likes/likes.service";
import { LikeTargetType } from "../likes/likes.interface";
import { sanitizePostContent } from "@/utils/sanitize";
import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "@/lib/httpStatus";
import { CommentsService } from "../comments/comments.service";
import { calculatePageSize } from "@/utils/calculatePageSize";

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
      const upload = await AWSFileUploader.uploadSingleFile(
        file,
        "posts/images"
      );

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

  async getLikesByPost(id: Types.ObjectId) {
    const post = await PostModel.findById(id);
    if (!post) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "Post was not found");
    }

    return await LikesService.getLikeByTargetResource(id);
  }

  async getCommentsByPost(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    options: IPaginationOptions
  ) {
    const post = await PostModel.findById(id).lean();
    if (!post) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "Post was not found");
    }

    return await CommentsService.getCommentsByPost(id, userId, options);
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
