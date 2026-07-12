import { Types } from "mongoose";
import { IMedia } from "../media/media.interface";

export enum Visibility {
  PUBLIC = "public",
  PRIVATE = "private",
}

export interface IPost {
  author_id: Types.ObjectId;

  content: string;

  image_id?: Types.ObjectId | IMedia;

  visibility: Visibility;

  like_count?: number;

  comment_count?: number;

  created_at?: Date;

  updated_at?: Date;

  deleted_at?: Date | null; // for soft delete
}

export interface FeedPostDto {
  id: string;

  content: string;

  created_at: Date;

  like_count: number;

  comment_count: number;

  author: {
    id: string;

    name: string;

    avatar_url: string | null;
  };

  image_url: string | null;
}
