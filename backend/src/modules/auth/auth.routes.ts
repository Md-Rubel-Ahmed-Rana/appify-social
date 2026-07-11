import { Router } from "express";
import { AuthController } from "./auth.controller";
import { JwtInstance } from "@/lib/jwt";
import validateRequest from "@/middlewares/validateRequest";
import { AuthValidations } from "./auth.validate";

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

export const AuthRoutes = router;
