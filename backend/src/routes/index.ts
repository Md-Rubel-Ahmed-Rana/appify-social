import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { PostsRoutes } from "@/modules/posts/posts.routes";
import { JwtInstance } from "@/lib/jwt";
import { LikeRoutes } from "@/modules/likes/likes.routes";
import { CommentsRoutes } from "@/modules/comments/comments.routes";
import { RepliesRoutes } from "@/modules/replies/replies.routes";

const router = Router();

router.use("/auth", AuthRoutes);

router.use("/posts", JwtInstance.authenticate(), PostsRoutes);

router.use("/likes", JwtInstance.authenticate(), LikeRoutes);

router.use("/comments", JwtInstance.authenticate(), CommentsRoutes);

router.use("/replies", JwtInstance.authenticate(), RepliesRoutes);

export const AppRoutes = router;
