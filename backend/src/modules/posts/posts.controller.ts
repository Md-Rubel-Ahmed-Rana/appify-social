import BaseController from "@/shared/baseController";
import { Request, Response } from "express";
import { PostsService } from "./posts.service";
import { HttpStatusCode } from "@/lib/httpStatus";
import ApiError from "@/middlewares/error";

class Controller extends BaseController {
  create = this.catchAsync(async (req: Request, res: Response) => {
    const file = req.file;

    if (!file && !req?.body?.content?.trim()) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "At least one field must be provided to create a post."
      );
    }

    const result = await PostsService.create(
      {
        author_id: req.user.id,
        content: req.body.content,
        visibility: req.body.visibility,
      },
      file
    );

    this.sendResponse(res, {
      statusCode: HttpStatusCode.CREATED,
      success: true,
      message: "Your post has been created successfully",
      data: result,
    });
  });
}

export const PostsController = new Controller();
