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

  getPostsByAuthor = this.catchAsync(async (req: Request, res: Response) => {
    const options = pickQueries(req.query, paginationFields);
    const result = await PostsService.getPostsByAuthor(options, req.user.id);
    this.sendResponse(req, res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Author posts retrieved successfully",
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

  updatePost = this.catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as unknown as Types.ObjectId;
    const result = await PostsService.updatePost(
      id,
      req.user.id,
      req.body.content
    );

    this.sendResponse(req, res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Post updated successfully",
      data: result,
    });
  });

  toggleVisibility = this.catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as unknown as Types.ObjectId;
    const { visibility } = await PostsService.toggleVisibility(id, req.user.id);

    this.sendResponse(req, res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: `Post visibility updated to "${visibility}" successfully`,
      data: null,
    });
  });

  delete = this.catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as unknown as Types.ObjectId;
    const result = await PostsService.delete(id, req.user.id);

    this.sendResponse(req, res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Post deleted successfully",
      data: result,
    });
  });
}

export const PostsController = new Controller();
