import ApiError from "@/middlewares/error";
import { IUser } from "./users.interface";
import { UserModel } from "./users.model";
import { HttpStatusCode } from "@/lib/httpStatus";
import { Types } from "mongoose";

class Service {
  async create(data: IUser) {
    const isExist = await UserModel.findOne({
      email: data.email,
    });

    if (isExist) {
      throw new ApiError(
        HttpStatusCode.CONFLICT,
        `You already have an account. Please login to your account`
      );
    }

    const result = await UserModel.create(data);
    return result;
  }

  async getLoggedInUser(id: Types.ObjectId) {
    const user = await UserModel.findById(id).select({ password: 0 });

    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "Invalid credentials");
    }

    return user;
  }

  async getUserByIdWithPassword(id: Types.ObjectId) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User was not found");
    }
    return user;
  }

  async getUserByEmailWithPassword(email: string) {
    return await UserModel.findOne({ email }).select("+password");
  }

  async getUserByIdWithoutPassword(id: Types.ObjectId) {
    const user = await UserModel.findById(id).select({ password: 0 });
    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "User was not found");
    }
    return user;
  }
}

export const UserService = new Service();
