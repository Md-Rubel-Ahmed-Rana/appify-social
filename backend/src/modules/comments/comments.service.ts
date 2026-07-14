import mongoose, { Types } from "mongoose";
import { IComment } from "./comments.interface";
import { CommentModel } from "./comments.model";
import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "@/lib/httpStatus";
import { PostModel } from "../posts/posts.model";

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
    session.startTransaction();
    try {
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

      await CommentModel.findByIdAndDelete(id, { session });

      await PostModel.findByIdAndUpdate(
        comment.post_id,
        {
          $inc: { comment_count: -1 },
        },
        { session }
      );

      await session.commitTransaction();
    } catch (error) {
      console.log(error);
      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to delete comment. Please try again!"
      );
    } finally {
      await session.endSession();
    }
  }
}

export const CommentsService = new Service();
