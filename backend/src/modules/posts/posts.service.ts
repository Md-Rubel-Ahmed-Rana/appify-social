import { AWSFileUploader } from "../aws/uploader";
import { MediaOwnerType } from "../media/media.interface";
import { MediaService } from "../media/media.service";
import { IPost } from "./posts.interface";
import { PostModel } from "./posts.model";

class Service {
  async create(data: IPost, file?: Express.Multer.File) {
    const post = await PostModel.create(data);

    if (file) {
      const upload = await AWSFileUploader.uploadSingleFile(
        file,
        "posts/images"
      );

      const media = await MediaService.create({
        ...upload,
        uploaded_by: data.author_id,
        owner_id: post._id,
        owner_type: MediaOwnerType.POST,
      });

      post.image_id = media._id;

      await post.save();
    }

    return {
      id: post._id,
    };
  }
}

export const PostsService = new Service();
