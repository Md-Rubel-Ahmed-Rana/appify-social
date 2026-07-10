import { Schema, model } from "mongoose";
import { IUser } from "./users.interface";
import { schemaOptions } from "@/utils/schemaOptions";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      trim: true,
    },
    role: { type: String, default: "User" },
    password: { type: String, required: true, select: false },
  },
  schemaOptions
);

export const UserModel = model<IUser>("User", userSchema);
