import { Types } from "mongoose";

export enum MediaOwnerType {
  POST = "post",
  COMMENT = "comment",
  REPLY = "reply",
  AVATAR = "avatar",
}

export interface IMedia {
  uploaded_by: Types.ObjectId;

  owner_type: MediaOwnerType;

  owner_id: Types.ObjectId;

  url: string;

  public_id: string;

  mime_type: string;

  original_name: string;

  extension: string;

  file_size: number;

  width: number;

  height: number;

  storage_provider?: "s3";
}
