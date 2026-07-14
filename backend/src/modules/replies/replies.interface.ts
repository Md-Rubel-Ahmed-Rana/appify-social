import { Types } from "mongoose";

export interface IReply {
  comment_id: Types.ObjectId;

  parent_reply_id?: Types.ObjectId | null;

  author_id: Types.ObjectId;

  reply_to_user_id?: Types.ObjectId | null;

  content: string;

  like_count?: number;

  deleted_at?: Date | null;

  created_at?: Date;
  updated_at?: Date;
}
