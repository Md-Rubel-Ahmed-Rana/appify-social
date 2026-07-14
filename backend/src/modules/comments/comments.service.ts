import mongoose, { QueryFilter, Types } from "mongoose";
import { IComment } from "./comments.interface";
import { CommentModel } from "./comments.model";
import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "@/lib/httpStatus";
import { PostModel } from "../posts/posts.model";
import { LikesService } from "../likes/likes.service";
import { LikeTargetType } from "../likes/likes.interface";
import { calculatePageSize } from "@/utils/calculatePageSize";
import { IPaginationOptions } from "@/interfaces/pagination.interfaces";
import { LikeModel } from "../likes/likes.model";
import { ReplyModel } from "../replies/replies.model";

class Service {
  async create(data: IComment) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const [result] = await CommentModel.create([data], { session });

      await PostModel.findByIdAndUpdate(
        data.post_id,
        {
          $inc: { comment_count: 1 },
        },
        { session }
      );

      await session.commitTransaction();

      return {
        id: result._id,
      };
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to post your comment. Please try again!"
      );
    } finally {
      await session.endSession();
    }
  }

  async update(id: Types.ObjectId, authorId: Types.ObjectId, content: string) {
    const result = await CommentModel.findOneAndUpdate(
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
        HttpStatusCode.UNAUTHORIZED,
        "Comment not found or you are not authorized to perform the action."
      );
    }
  }

  async delete(id: Types.ObjectId, authorId: Types.ObjectId) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const comment = await CommentModel.findOne({
        _id: id,
        author_id: authorId,
      }).session(session);

      if (!comment) {
        throw new ApiError(
          HttpStatusCode.NOT_FOUND,
          "Comment was not found or you are not authorized to perform the action."
        );
      }

      await comment.deleteOne({ session });

      await PostModel.findByIdAndUpdate(
        comment.post_id,
        { $inc: { comment_count: -1 } },
        { session }
      );

      // remove the comments' likes
      await LikeModel.deleteMany(
        {
          target_id: comment._id,
          target_type: LikeTargetType.COMMENT,
        },
        { session }
      );

      // remove the replies of this comment
      const replies = await ReplyModel.find(
        { comment_id: comment._id },
        { _id: 1 }
      ).session(session);

      const replyIds = replies.map((r) => r._id);

      await ReplyModel.deleteMany({ comment_id: comment._id }, { session });

      if (replyIds.length) {
        await LikeModel.deleteMany(
          {
            target_id: { $in: replyIds },
            target_type: LikeTargetType.REPLY,
          },
          { session }
        );
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();

      if (error instanceof ApiError) {
        throw error;
      }

      console.error(error);

      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to delete comment. Please try again!"
      );
    } finally {
      await session.endSession();
    }
  }

  async getCommentsByPost(
    postId: Types.ObjectId,
    userId: Types.ObjectId,
    options: IPaginationOptions
  ) {
    const { limit = 10, cursor } = options;

    const safeLimit = calculatePageSize(limit);

    const filter: QueryFilter<IComment> = {
      post_id: postId,
      deleted_at: null,
    };

    if (cursor) {
      filter._id = {
        $lt: new Types.ObjectId(cursor),
      };
    }

    const comments = await CommentModel.find(filter) // DB call -2
      .sort({ _id: -1 })
      .limit(safeLimit)
      .populate({
        path: "author_id",
        select: "first_name last_name avatar_id",
        populate: {
          path: "avatar_id",
          select: "url",
        },
      })
      .lean();

    if (!comments.length) {
      return {
        meta: {
          page_size: safeLimit,
          post_count: 0,
          next_cursor: null,
          has_more: false,
        },
        comments: [],
      };
    }

    const commentIds = comments.map((comment) => comment._id);
    const currentUserLikes = await LikesService.getLikesByUserForTargets(
      // DB Call -3
      userId,
      LikeTargetType.COMMENT,
      commentIds
    );

    const likedCommentIds = new Set(
      currentUserLikes.map((like) => like?.target_id?.toString())
    );

    const commentsDto = comments.map((comment: any) => ({
      id: comment._id,
      content: comment.content,
      reply_count: comment.reply_count,
      like_count: comment.like_count,
      author: {
        first_name: comment.author_id.first_name,
        last_name: comment.author_id.last_name,
        avatar_url: comment.author_id.avatar_id?.url ?? null,
      },
      is_liked: likedCommentIds.has(comment._id.toString()),
      created_at: comment.created_at,
    }));

    const nextCursor =
      comments.length === safeLimit
        ? comments[comments.length - 1]._id.toString()
        : null;

    return {
      meta: {
        page_size: safeLimit,
        post_count: commentsDto.length,
        next_cursor: nextCursor,
        has_more: !!nextCursor,
      },
      comments: commentsDto,
    };
  }
}

export const CommentsService = new Service();
