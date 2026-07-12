import { IMedia } from "./media.interface";
import { MediaModel } from "./media.model";

class Service {
  async create(data: IMedia) {
    return await MediaModel.create(data);
  }
}

export const MediaService = new Service();
