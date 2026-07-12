import { Router } from "express";
import { PostsController } from "./posts.controller";
import { upload } from "@/config/multer";

const router = Router();

router.get("/", PostsController.getFeedPosts);

router.post("/", upload.single("image"), PostsController.create);

export const PostsRoutes = router;
