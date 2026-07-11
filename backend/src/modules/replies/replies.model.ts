import { model, Schema } from "mongoose";
import { schemaOptions } from "@/utils/schemaOptions";
import { IReply } from "./replies.interface";

const replySchema = new Schema<IReply>(
  {
    comment_id: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "Comment",
    },

    author_id: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "User",
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    like_count: {
      type: Number,
      default: 0,
    },

    deleted_at: {
      type: Date,
      default: null,
    },
  },
  schemaOptions
);

export const ReplyModel = model("Reply", replySchema);
