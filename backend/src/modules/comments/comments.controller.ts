import BaseController from "@/shared/baseController";
import { CommentsService } from "./comments.service";
import { HttpStatusCode } from "@/lib/httpStatus";
import { Types } from "mongoose";
import pickQueries from "@/shared/pickQueries";
import { paginationFields } from "@/constants/paginationFields";

class Controller extends BaseController {
  getCommentsByPost = this.catchAsync(async (req, res) => {
    const post_id = req.query.post_id as unknown as Types.ObjectId;
    const options = pickQueries(req.query, paginationFields);
    const result = await CommentsService.getCommentsByPost(
      post_id,
      req.user.id,
      options
    );

    this.sendResponse(req, res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Comments retrieved successfully",
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

  delete = this.catchAsync(async (req, res) => {
    const id = req.params.id as unknown as Types.ObjectId;
    const result = await CommentsService.delete(id, req.user.id);

    this.sendResponse(req, res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Comment has been removed successfully",
      data: result,
    });
  });
}

export const CommentsController = new Controller();
