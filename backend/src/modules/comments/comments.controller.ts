import BaseController from "@/shared/baseController";
import { CommentsService } from "./comments.service";
import { HttpStatusCode } from "@/lib/httpStatus";

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
      message: "Your comment has need post successfully",
      data: result,
    });
  });
}

export const CommentsController = new Controller();
