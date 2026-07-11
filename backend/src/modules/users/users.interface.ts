import { Types } from "mongoose";

export interface IUser {
  id: Types.ObjectId | string;
  _id: Types.ObjectId | string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string;
  bio: string;
  role: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
