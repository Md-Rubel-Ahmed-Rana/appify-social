import { Types } from "mongoose";

export interface IReply {
  comment_id: Types.ObjectId;

  author_id: Types.ObjectId;

  content: string;

  like_count: number;

  created_at?: Date;

  updated_at?: Date;

  deleted_at?: Date;
}
