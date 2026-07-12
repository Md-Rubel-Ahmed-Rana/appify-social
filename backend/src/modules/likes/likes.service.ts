import { Types } from "mongoose";
import { LikeModel } from "./likes.model";
import { LikeTargetType } from "./likes.interface";

class Service {
  async getLikesByUser(userId: Types.ObjectId, target_type: LikeTargetType) {
    return await LikeModel.find({ user_id: userId, target_type });
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
