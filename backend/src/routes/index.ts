import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { PostsRoutes } from "@/modules/posts/posts.routes";
import { JwtInstance } from "@/lib/jwt";
import { LikeRoutes } from "@/modules/likes/likes.routes";

const router = Router();

router.use("/auth", AuthRoutes);

router.use("/posts", JwtInstance.authenticate(), PostsRoutes);

router.use("/likes", JwtInstance.authenticate(), LikeRoutes);

export const AppRoutes = router;
