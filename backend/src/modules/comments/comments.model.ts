import { model, Schema } from "mongoose";
import { IComment } from "./comments.interface";
import { schemaOptions } from "@/utils/schemaOptions";

const commentSchema = new Schema<IComment>(
  {
    post_id: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "Post",
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

    reply_count: {
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

export const CommentModel = model("Comment", commentSchema);
