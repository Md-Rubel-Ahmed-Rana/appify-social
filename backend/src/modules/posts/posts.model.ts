import { model, Schema } from "mongoose";
import { IPost, Visibility } from "./posts.interface";
import { schemaOptions } from "@/utils/schemaOptions";

const postSchema = new Schema<IPost>(
  {
    author_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    image_id: {
      type: Schema.Types.ObjectId,
      ref: "Media",
      default: null,
    },

    content: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    visibility: {
      type: String,
      enum: Visibility,
      default: Visibility.PUBLIC,
      index: true,
    },

    like_count: {
      type: Number,
      default: 0,
    },

    comment_count: {
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

postSchema.index({
  visibility: 1,
  deleted_at: 1,
  created_at: -1,
});

postSchema.index({
  author_id: 1,
  deleted_at: 1,
  created_at: -1,
});
export const PostModel = model("Post", postSchema);
