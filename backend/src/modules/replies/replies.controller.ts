import BaseController from "@/shared/baseController";
import { RepliesService } from "./replies.service";
import { HttpStatusCode } from "@/lib/httpStatus";
import { Types } from "mongoose";

class Controller extends BaseController {
  create = this.catchAsync(async (req, res) => {
    const { comment_id, content, parent_reply_id, reply_to_user_id } = req.body;
    const result = await RepliesService.create({
      author_id: req.user.id,
      comment_id,
      content,
      parent_reply_id,
      reply_to_user_id,
    });
    this.sendResponse(req, res, {
      statusCode: HttpStatusCode.CREATED,
      success: true,
      message: "Reply has been posted successfully",
      data: result,
    });
  });

  getRepliesByComment = this.catchAsync(async (req, res) => {
    const comment_id = req.query.comment_id as unknown as Types.ObjectId;
    const result = await RepliesService.getRepliesByComment(comment_id);
    this.sendResponse(req, res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Replies retrieved successfully",
      data: {
        current_user: {
          id: req.user.id,
          first_name: req.user.first_name,
          last_name: req.user.last_name,
        },
        ...result,
      },
    });
  });
}

export const RepliesController = new Controller();
