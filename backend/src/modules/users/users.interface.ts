import { Types } from "mongoose";
import { IMedia } from "../media/media.interface";

export interface IUser {
  _id: Types.ObjectId;
  first_name: string;
  last_name: string;
  email: string;
  avatar_id: Types.ObjectId | IMedia;
  bio: string;
  role: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}
