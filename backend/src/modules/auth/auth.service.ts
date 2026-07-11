import { BcryptInstance } from "@/lib/bcrypt";
import { IUser } from "../users/users.interface";
import { UserService } from "../users/users.service";
import ApiError from "@/middlewares/error";
import { Types } from "mongoose";
import { JwtInstance } from "@/lib/jwt";
import { HttpStatusCode } from "@/lib/httpStatus";
import {
  IJWtPayload,
  ILoginPayload,
  ILoginResponse,
} from "@/interfaces/common.interface";

class Service {
  async register(data: IUser) {
    data.password = await BcryptInstance.hash(data.password);

    const user = await UserService.create(data);

    return await this.generateAuthResponse(user);
  }

  async login(data: ILoginPayload) {
    const user = await UserService.getUserByEmailWithPassword(data.email);

    if (!user) {
      throw new ApiError(
        HttpStatusCode.UNAUTHORIZED,
        "Invalid email or password"
      );
    }

    const isPasswordMatched = await BcryptInstance.compare(
      data.password,
      user.password
    );

    if (!isPasswordMatched) {
      throw new ApiError(
        HttpStatusCode.UNAUTHORIZED,
        "Invalid email or password."
      );
    }

    return await this.generateAuthResponse(user);
  }

  async getLoggedInUser(id: Types.ObjectId) {
    const user = await UserService.getUserByIdWithoutPassword(id);

    return {
      id: user.id || user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      avatar_url: user.avatar_url,
      bio: user.bio,
    };
  }

  private async generateAuthResponse(user: IUser) {
    const jwtPayload: IJWtPayload = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    };

    const { access_token, refresh_token } =
      await JwtInstance.generateTokens(jwtPayload);

    return {
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        avatar_url: user.avatar_url,
        bio: user.bio,
      },
      access_token: `Bearer ${access_token}`,
      refresh_token: `Bearer ${refresh_token}`,
    };
  }
}

export const AuthService = new Service();
