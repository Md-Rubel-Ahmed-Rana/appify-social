import { Router } from "express";
import { PostsController } from "./posts.controller";
import { upload } from "@/config/multer";
import { feedLimiter } from "@/middlewares/rate-limiter/feed-limiter";
import { createPostLimiter } from "@/middlewares/rate-limiter/create-post-limiter";

const router = Router();

router.get("/", feedLimiter, PostsController.getFeedPosts);

router.get("/:id/likes", PostsController.getLikesByPost);

router.get("/:id/comments", PostsController.getCommentsByPost);

router.post(
  "/",
  createPostLimiter,
  upload.single("image"),
  PostsController.create
);

export const PostsRoutes = router;
