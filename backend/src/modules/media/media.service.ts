import mongoose, { Types } from "mongoose";
import { IMedia, MediaOwnerType } from "./media.interface";
import { MediaModel } from "./media.model";
import { emitter } from "@/events/eventEmitter";

class Service {
  async create(data: IMedia) {
    return await MediaModel.create(data);
  }

  async delete(
    owner_id: Types.ObjectId,
    owner_type: MediaOwnerType,
    session: mongoose.mongo.ClientSession
  ) {
    const media = await MediaModel.findOne({ owner_id, owner_type })
      .select("public_id")
      .session(session);

    if (!media) {
      // Don't throw error. Just silently ignore with a log
      console.log({
        from: "[MediaService]: Delete Media",
        message: "Media was not found to delete",
        payload: { owner_id, owner_type },
      });
      return false;
    }

    // delete the media document
    await media.deleteOne({ session });

    // publish event to delete file from S3
    emitter.emit("s3.file.deleted", media.public_id);

    return true;
  }
}

export const MediaService = new Service();
