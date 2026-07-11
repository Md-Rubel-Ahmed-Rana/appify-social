import { Types } from "mongoose";

export interface IComment {
  post_id: Types.ObjectId;

  author_id: Types.ObjectId;

  content: string;

  reply_count: number;

  like_count: number;

  created_at?: Date;

  updated_at?: Date;

  deleted_at?: Date;
}
