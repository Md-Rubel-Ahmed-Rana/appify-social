import validateRequest from "@/middlewares/validateRequest";
import { Router } from "express";
import { ReplyValidations } from "./replies.validate";
import { RepliesController } from "./replies.controller";

const router = Router();

router
  .route("/")
  .get(RepliesController.getRepliesByComment)
  .post(validateRequest(ReplyValidations.reply), RepliesController.create);

export const RepliesRoutes = router;
