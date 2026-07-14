import BaseController from "@/shared/baseController";
import { RepliesService } from "./replies.service";
import { HttpStatusCode } from "@/lib/httpStatus";

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
}

export const RepliesController = new Controller();
