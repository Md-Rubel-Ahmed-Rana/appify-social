import mongoose, { Types } from "mongoose";
import { IReply } from "./replies.interface";
import { ReplyModel } from "./replies.model";
import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "@/lib/httpStatus";
import { CommentModel } from "../comments/comments.model";
import { LikesService } from "../likes/likes.service";
import { LikeTargetType } from "../likes/likes.interface";
import { LikeModel } from "../likes/likes.model";

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

  async getRepliesByComment(commentId: Types.ObjectId, userId: Types.ObjectId) {
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

    const replyIds = replies.map((reply) => reply._id);

    const currentUserLikes = await LikesService.getLikesByUserForTargets(
      userId,
      LikeTargetType.REPLY,
      replyIds
    );

    const likedRepliedIds = new Set(
      currentUserLikes.map((like) => like?.target_id?.toString())
    );

    return {
      replies: replies.map((reply: any) => ({
        id: reply._id,
        content: reply.content,
        like_count: reply.like_count,
        created_at: reply.created_at,
        is_liked: likedRepliedIds.has(reply._id.toString()),
        is_owner: userId.toString() === reply.author_id._id.toString(),
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

  async update(id: Types.ObjectId, authorId: Types.ObjectId, content: string) {
    const reply = await ReplyModel.findOneAndUpdate(
      {
        _id: id,
        author_id: authorId,
      },
      {
        $set: { content },
      }
    );

    if (!reply) {
      throw new ApiError(
        HttpStatusCode.NOT_FOUND,
        "Reply not found or you are not authorized to perform action"
      );
    }
  }

  async delete(id: Types.ObjectId, authorId: Types.ObjectId) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const reply = await ReplyModel.findOne({
        _id: id,
        author_id: authorId,
      }).session(session);

      if (!reply) {
        throw new ApiError(
          HttpStatusCode.NOT_FOUND,
          "Reply was not found or you are not authorized to perform the action."
        );
      }

      const [tree] = await ReplyModel.aggregate<{
        descendants: { _id: Types.ObjectId }[];
      }>([
        {
          $match: {
            _id: reply._id,
          },
        },
        {
          $graphLookup: {
            from: ReplyModel.collection.name,
            startWith: "$_id",
            connectFromField: "_id",
            connectToField: "parent_reply_id",
            as: "descendants",
          },
        },
        {
          $project: {
            descendants: {
              $map: {
                input: "$descendants",
                as: "reply",
                in: {
                  _id: "$$reply._id",
                },
              },
            },
          },
        },
      ]).session(session);

      const replyIds = [
        reply._id,
        ...(tree?.descendants?.map((r) => r._id) ?? []),
      ];

      await Promise.all([
        LikeModel.deleteMany(
          {
            target_id: { $in: replyIds },
            target_type: LikeTargetType.REPLY,
          },
          { session }
        ),

        ReplyModel.deleteMany(
          {
            _id: { $in: replyIds },
          },
          { session }
        ),

        CommentModel.findByIdAndUpdate(
          reply.comment_id,
          {
            $inc: {
              reply_count: -replyIds.length,
            },
          },
          { session }
        ),
      ]);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();

      if (error instanceof ApiError) {
        throw error;
      }

      console.error(error);

      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to delete reply. Please try again!"
      );
    } finally {
      await session.endSession();
    }
  }
}

export const RepliesService = new Service();
