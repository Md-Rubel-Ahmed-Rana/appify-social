import mongoose, { Types } from "mongoose";
import { IReply } from "./replies.interface";
import { ReplyModel } from "./replies.model";
import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "@/lib/httpStatus";
import { CommentModel } from "../comments/comments.model";

class Service {
  async create(data: IReply) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const comment = await CommentModel.findOne({
        _id: data.comment_id,
        deleted_at: null,
      }).session(session);

      if (!comment) {
        throw new ApiError(HttpStatusCode.NOT_FOUND, "Comment was not found.");
      }

      if (data.parent_reply_id) {
        const parentReply = await ReplyModel.findOne({
          _id: data.parent_reply_id,
          deleted_at: null,
        }).session(session);

        if (!parentReply) {
          throw new ApiError(HttpStatusCode.NOT_FOUND, "Reply was not found.");
        }

        if (!parentReply.comment_id.equals(data.comment_id)) {
          throw new ApiError(HttpStatusCode.BAD_REQUEST, "Invalid reply.");
        }

        data.reply_to_user_id = parentReply.author_id;
      } else {
        data.reply_to_user_id = null;
        data.parent_reply_id = null;
      }

      const [reply] = await ReplyModel.create([data], { session });

      await CommentModel.updateOne(
        { _id: data.comment_id },
        {
          $inc: {
            reply_count: 1,
          },
        },
        { session }
      );

      await session.commitTransaction();

      return {
        reply_id: reply._id,
        comment_id: data.comment_id,
        parent_reply_id: data.parent_reply_id,
      };
    } catch (error) {
      await session.abortTransaction();

      if (error instanceof ApiError) {
        throw error;
      }

      console.error(error);

      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to reply. Please try again!"
      );
    } finally {
      await session.endSession();
    }
  }

  async getRepliesByComment(commentId: Types.ObjectId) {
    if (!commentId?.toString()?.trim()) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, "Comment id is required");
    }
    const replies = await ReplyModel.find({
      comment_id: commentId,
      deleted_at: null,
    })
      .select(
        "_id comment_id parent_reply_id author_id reply_to_user_id content like_count created_at"
      )
      .populate({
        path: "author_id",
        select: "_id first_name last_name avatar_id",
        populate: {
          path: "avatar_id",
          select: "_id url",
        },
      })
      .populate({
        path: "reply_to_user_id",
        select: "_id first_name last_name avatar_id",
        populate: {
          path: "avatar_id",
          select: "_id url",
        },
      })
      .sort({ created_at: 1 })
      .lean();

    return {
      replies: replies.map((reply: any) => ({
        id: reply._id,
        content: reply.content,
        like_count: reply.like_count,
        created_at: reply.created_at,
        parent_reply_id: reply.parent_reply_id,
        author: {
          id: reply.author_id._id,
          name: reply.author_id.first_name + reply.author_id.last_name,
          avatar_url: reply.author_id.avatar_id.url || null,
        },
        reply_to_user: reply.reply_to_user_id
          ? {
              id: reply.reply_to_user_id._id,
              name:
                reply.reply_to_user_id.first_name +
                reply.reply_to_user_id.last_name,
              avatar_url: reply.reply_to_user_id.avatar_id.url || null,
            }
          : null,
      })),
    };
  }
}

export const RepliesService = new Service();
