import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { PostsRoutes } from "@/modules/posts/posts.routes";
import { JwtInstance } from "@/lib/jwt";

const router = Router();

router.use("/auth", AuthRoutes);

router.use("/posts", JwtInstance.authenticate(), PostsRoutes);

export const AppRoutes = router;
