import BaseController from "@/shared/baseController";
import { CommentsService } from "./comments.service";
import { HttpStatusCode } from "@/lib/httpStatus";
import { Types } from "mongoose";

class Controller extends BaseController {
  create = this.catchAsync(async (req, res) => {
    const result = await CommentsService.create({
      author_id: req.user.id,
      content: req.body.content,
      post_id: req.body.post_id,
    });

    this.sendResponse(req, res, {
      statusCode: HttpStatusCode.CREATED,
      success: true,
      message: "Your comment has been post successfully",
      data: result,
    });
  });

  update = this.catchAsync(async (req, res) => {
    const id = req.params.id as unknown as Types.ObjectId;
    const result = await CommentsService.update(
      id,
      req.user.id,
      req.body.content
    );

    this.sendResponse(req, res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Comment has been updated successfully",
      data: result,
    });
  });
}

export const CommentsController = new Controller();
