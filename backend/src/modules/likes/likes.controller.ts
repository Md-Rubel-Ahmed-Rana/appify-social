import BaseController from "@/shared/baseController";
import { LikesService } from "./likes.service";
import { HttpStatusCode } from "@/lib/httpStatus";
import { Types } from "mongoose";
import { LikeTargetType } from "./likes.interface";

class Controller extends BaseController {
  getLikeByTargetIdAndType = this.catchAsync(async (req, res) => {
    const { target_id, target_type } = req.query;
    const targetId = new Types.ObjectId(target_id as string);
    const result = await LikesService.getLikeByTargetIdAndType(
      targetId,
      target_type as LikeTargetType
    );
    this.sendResponse(req, res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Likes retrieved successfully",
      data: result,
    });
  });

  like = this.catchAsync(async (req, res) => {
    const { target_id, target_type } = req.body;
    await LikesService.like({ target_type, target_id, user_id: req.user.id });
    this.sendResponse(req, res, {
      statusCode: HttpStatusCode.CREATED,
      success: true,
      message: "Like has been done",
    });
  });

  unlike = this.catchAsync(async (req, res) => {
    const { target_id, target_type } = req.body;
    await LikesService.unlike({ target_type, target_id, user_id: req.user.id });
    this.sendResponse(req, res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Unlike has been done",
    });
  });
}

export const LikeController = new Controller();
