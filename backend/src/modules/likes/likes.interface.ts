import { Types } from "mongoose";

export enum LikeTargetType {
  POST = "post",
  COMMENT = "comment",
  REPLY = "reply",
}

export interface ILike {
  user_id: Types.ObjectId;

  target_type: LikeTargetType;

  target_id: Types.ObjectId;

  created_at?: Date;

  updated_at?: Date;
}
