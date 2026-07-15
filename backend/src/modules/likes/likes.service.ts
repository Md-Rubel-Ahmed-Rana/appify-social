import mongoose, { Types } from "mongoose";
import { LikeModel } from "./likes.model";
import { ILike, LikeTargetType } from "./likes.interface";
import { PostModel } from "../posts/posts.model";
import { CommentModel } from "../comments/comments.model";
import { ReplyModel } from "../replies/replies.model";
import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "@/lib/httpStatus";

class Service {
  private async processLike(data: ILike, increment: 1 | -1): Promise<void> {
    const session = await mongoose.startSession();

    const modelMap = {
      [LikeTargetType.POST]: PostModel,
      [LikeTargetType.COMMENT]: CommentModel,
      [LikeTargetType.REPLY]: ReplyModel,
    } as const;

    try {
      session.startTransaction();

      if (increment === 1) {
        await LikeModel.create([data], { session });
      } else {
        const { deletedCount } = await LikeModel.deleteOne(
          {
            user_id: data.user_id,
            target_type: data.target_type,
            target_id: data.target_id,
          },
          { session }
        );

        if (deletedCount === 0) {
          throw new ApiError(HttpStatusCode.NOT_FOUND, "Like not found.");
        }
      }

      const Model = modelMap[data.target_type];

      const result = await (Model as any).updateOne(
        {
          _id: data.target_id,
        },
        {
          $inc: {
            like_count: increment,
          },
        },
        {
          session,
        }
      );

      if (result.matchedCount === 0) {
        throw new ApiError(
          HttpStatusCode.NOT_FOUND,
          `${data.target_type} not found.`
        );
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.log(error);

      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        `Failed to ${
          increment === 1 ? "like" : "unlike"
        } the resource. Please try again.`
      );
    } finally {
      await session.endSession();
    }
  }

  async like(data: ILike) {
    await this.processLike(data, 1);
  }

  async unlike(data: ILike) {
    await this.processLike(data, -1);
  }

  async getLikeByTargetIdAndType(
    target_id: Types.ObjectId,
    target_type: LikeTargetType
  ) {
    const likes = await LikeModel.find({ target_id, target_type })
      .select("user_id")
      .populate({
        path: "user_id",
        select: "first_name last_name avatar_id",
        populate: {
          path: "avatar_id",
          select: "url",
        },
      });

    return {
      likes: likes.map((like: any) => ({
        user_id: like.user_id._id,
        first_name: like.user_id.first_name,
        last_name: like.user_id.last_name,
        avatar_url: like.user_id.avatar_id.url,
      })),
    };
  }

  async getLikesByUserForTargets(
    userId: Types.ObjectId,
    targetType: LikeTargetType,
    targetIds: Types.ObjectId[]
  ) {
    return LikeModel.find({
      user_id: userId,
      target_type: targetType,
      target_id: {
        $in: targetIds,
      },
    })
      .select("target_id")
      .lean();
  }
}

export const LikesService = new Service();
