import { Schema, model } from "mongoose";
import { IUser } from "./users.interface";
import { schemaOptions } from "@/utils/schemaOptions";

const userSchema = new Schema<IUser>(
  {
    first_name: { type: String, required: true, trim: true, min: 1, max: 20 },
    last_name: { type: String, required: true, trim: true, min: 1, max: 20 },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      trim: true,
    },
    avatar_id: { type: Schema.Types.ObjectId, default: null, ref: "Media" },
    bio: { type: String, default: null },
    role: { type: String, default: "User" },
    password: { type: String, required: true, select: false },
  },
  schemaOptions
);

export const UserModel = model<IUser>("User", userSchema);
