import { Router } from "express";
import { AuthController } from "./auth.controller";
import { JwtInstance } from "@/lib/jwt";
import validateRequest from "@/middlewares/validateRequest";
import { AuthValidations } from "./auth.validate";
import { upload } from "@/config/multer";
import { UserMiddleware } from "@/middlewares/user.upload";

const router = Router();

router.post(
  "/register",
  validateRequest(AuthValidations.register),
  AuthController.register
);

router.post(
  "/login",
  validateRequest(AuthValidations.login),
  AuthController.login
);

router.get("/me", JwtInstance.authenticate(), AuthController.getLoggedInUser);

router.delete("/logout", JwtInstance.authenticate(), AuthController.logout);

router.patch(
  "/profile",
  JwtInstance.authenticate(),
  upload.single("avatar"),
  UserMiddleware.uploadUserAvatar,
  AuthController.updateUserProfile
);

export const AuthRoutes = router;
