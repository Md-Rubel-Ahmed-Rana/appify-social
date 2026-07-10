import { Document, Types } from "mongoose";

export type IUser = {
  id: Types.ObjectId | string;
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  role: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
} & Document;
