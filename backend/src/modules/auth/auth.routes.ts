import { Router } from "express";
import { AuthController } from "./auth.controller";
import { JwtInstance } from "@/lib/jwt";
import validateRequest from "@/middlewares/validateRequest";
import { UserValidations } from "../users/users.validate";

const router = Router();

router.post(
  "/register",
  validateRequest(UserValidations.create),
  AuthController.register
);

router.get("/me", JwtInstance.authenticate(), AuthController.getLoggedInUser);

router.post("/login", AuthController.login);

export const AuthRoutes = router;
