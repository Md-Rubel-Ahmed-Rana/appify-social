import { model, Schema } from "mongoose";
import { ILike, LikeTargetType } from "./likes.interface";
import { schemaOptions } from "@/utils/schemaOptions";

const likeSchema = new Schema<ILike>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    target_type: {
      type: String,
      enum: Object.values(LikeTargetType),
      required: true,
      index: true,
    },

    target_id: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
  },
  schemaOptions
);

likeSchema.index(
  {
    user_id: 1,
    target_type: 1,
    target_id: 1,
  },
  {
    unique: true,
  }
);

export const LikeModel = model("Like", likeSchema);
