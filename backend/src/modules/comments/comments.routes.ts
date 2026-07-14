import { Router } from "express";
import { CommentsController } from "./comments.controller";
import validateRequest from "@/middlewares/validateRequest";
import { CommentValidations } from "./comments.validate";

const router = Router();

router.post(
  "/",
  validateRequest(CommentValidations.create),
  CommentsController.create
);

export const CommentsRoutes = router;
