import { NextFunction, Request, Response } from "express";
import ApiError from "./error";
import { HttpStatusCode } from "@/lib/httpStatus";
import { S3Service } from "@/modules/aws/s3.service";
import { MediaService } from "@/modules/media/media.service";
import { MediaOwnerType } from "@/modules/media/media.interface";

class Middleware {
  async uploadUserAvatar(req: Request, res: Response, next: NextFunction) {
    const file = req.file;

    const body = req.body ?? {};

    const allowedFields = ["first_name", "last_name", "bio"];

    const hasBodyUpdate = allowedFields.some((field) => {
      const value = body[field];

      return value !== undefined && value !== null && value !== "";
    });

    if (!file && !hasBodyUpdate) {
      return next(
        new ApiError(
          HttpStatusCode.BAD_REQUEST,
          "At least one field must be provided for update."
        )
      );
    }

    if (!file) {
      return next();
    }

    try {
      const upload = await S3Service.uploadSingleFile(file, "avatars");

      const mediaResponse = await MediaService.create({
        ...upload,
        uploaded_by: req.user.id,
        owner_id: req.user.id,
        owner_type: MediaOwnerType.AVATAR,
      });

      req.body = {
        ...body,
        avatar_id: mediaResponse._id,
      };
      next();
    } catch (error) {
      console.log(error);
      next(
        new ApiError(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          "Error uploading user avatar"
        )
      );
    }
  }
}

export const UserMiddleware = new Middleware();
