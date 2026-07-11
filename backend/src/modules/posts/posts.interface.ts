import { Types } from "mongoose";

export enum Visibility {
  PUBLIC = "public",
  PRIVATE = "private",
}

export interface IPost {
  author_id: Types.ObjectId;

  content: string;

  visibility: Visibility;

  like_count: number;

  comment_count: number;

  media_count: number;

  created_at?: Date;

  updated_at?: Date;

  deleted_at?: Date | null; // for soft delete
}
