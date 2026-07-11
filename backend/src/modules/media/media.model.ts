import { Schema, model } from "mongoose";
import { IMedia, MediaOwnerType } from "./media.interface";
import { schemaOptions } from "@/utils/schemaOptions";

const mediaSchema = new Schema<IMedia>(
  {
    uploaded_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    owner_type: {
      type: String,
      enum: Object.values(MediaOwnerType),
      required: true,
      index: true,
    },

    owner_id: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    public_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    original_name: {
      type: String,
      required: true,
      trim: true,
    },

    mime_type: {
      type: String,
      required: true,
      trim: true,
    },

    extension: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    file_size: {
      type: Number,
      required: true,
      min: 0,
    },

    width: {
      type: Number,
      required: true,
      min: 0,
    },

    height: {
      type: Number,
      required: true,
      min: 0,
    },

    storage_provider: {
      type: String,
      default: "s3",
      enum: ["s3"],
    },
  },
  schemaOptions
);

mediaSchema.index({
  owner_type: 1,
  owner_id: 1,
});

mediaSchema.index({
  uploaded_by: 1,
  created_at: -1,
});

export const MediaModel = model<IMedia>("Media", mediaSchema);
