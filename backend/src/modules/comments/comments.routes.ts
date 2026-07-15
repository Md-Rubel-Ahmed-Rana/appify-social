import { Router } from "express";
import { CommentsController } from "./comments.controller";
import validateRequest from "@/middlewares/validateRequest";
import { CommentValidations } from "./comments.validate";

const router = Router();

router
  .route("/")
  .post(validateRequest(CommentValidations.create), CommentsController.create)
  .get(CommentsController.getCommentsByPost);

router
  .route("/:id")
  .patch(validateRequest(CommentValidations.update), CommentsController.update)
  .delete(CommentsController.delete);

export const CommentsRoutes = router;
