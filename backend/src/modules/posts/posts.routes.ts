import { Router } from "express";
import { PostsController } from "./posts.controller";
import { upload } from "@/config/multer";
import { feedLimiter } from "@/middlewares/rate-limiter/feed-limiter";
import { createPostLimiter } from "@/middlewares/rate-limiter/create-post-limiter";
import validateRequest from "@/middlewares/validateRequest";
import { PostValidations } from "./posts.validate";

const router = Router();

router.get("/author", PostsController.getPostsByAuthor);

router
  .route("/")
  .post(createPostLimiter, upload.single("image"), PostsController.create)
  .get(feedLimiter, PostsController.getFeedPosts);

router
  .route("/:id")
  .patch(validateRequest(PostValidations.update), PostsController.updatePost)
  .delete(PostsController.delete);

export const PostsRoutes = router;
