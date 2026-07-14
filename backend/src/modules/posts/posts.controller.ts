import BaseController from "@/shared/baseController";
import { Request, Response } from "express";
import { PostsService } from "./posts.service";
import { HttpStatusCode } from "@/lib/httpStatus";
import ApiError from "@/middlewares/error";
import pickQueries from "@/shared/pickQueries";
import { paginationFields } from "@/constants/paginationFields";
import { Types } from "mongoose";

class Controller extends BaseController {
  create = this.catchAsync(async (req: Request, res: Response) => {
    const file = req.file;

    if (!file && !req.body?.content?.trim()) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        "At least one field must be provided to create a post."
      );
    }

    const result = await PostsService.create(
      {
        author_id: req.user.id,
        content: req.body?.content,
        visibility: req.body.visibility,
      },
      file
    );

    this.sendResponse(req, res, {
      statusCode: HttpStatusCode.CREATED,
      success: true,
      message: "Your post has been published successfully",
      data: result,
    });
  });

  getFeedPosts = this.catchAsync(async (req: Request, res: Response) => {
    const options = pickQueries(req.query, paginationFields);
    const result = await PostsService.getFeedPosts(options, req.user.id);
    this.sendResponse(req, res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Feed posts retrieved successfully",
      data: result,
    });
  });

  getLikesByPost = this.catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as unknown as Types.ObjectId;
    const result = await PostsService.getLikesByPost(id);
    this.sendResponse(req, res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Post likes retrieved successfully",
      data: result,
    });
  });

  getCommentsByPost = this.catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as unknown as Types.ObjectId;
    const options = pickQueries(req.query, paginationFields);
    const result = await PostsService.getCommentsByPost(
      id,
      req.user.id,
      options
    );

    this.sendResponse(req, res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Post's comments retrieved successfully",
      data: result,
    });
  });
}

export const PostsController = new Controller();
