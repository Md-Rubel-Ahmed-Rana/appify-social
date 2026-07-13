import BaseController from "@/shared/baseController";
import { LikesService } from "./likes.service";
import { HttpStatusCode } from "@/lib/httpStatus";

class Controller extends BaseController {
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
