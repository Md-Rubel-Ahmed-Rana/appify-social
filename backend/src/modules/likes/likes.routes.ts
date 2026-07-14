import validateRequest from "@/middlewares/validateRequest";
import { Router } from "express";
import { LikeValidations } from "./likes.validate";
import { LikeController } from "./likes.controller";

const router = Router();

router
  .route("/")
  .get(LikeController.getLikeByTargetIdAndType)
  .post(validateRequest(LikeValidations.create), LikeController.like)
  .delete(validateRequest(LikeValidations.create), LikeController.unlike);

export const LikeRoutes = router;
