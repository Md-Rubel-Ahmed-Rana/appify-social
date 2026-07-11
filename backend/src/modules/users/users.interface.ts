import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string;
  bio: string;
  role: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}
