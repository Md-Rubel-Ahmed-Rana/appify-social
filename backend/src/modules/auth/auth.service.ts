import { BcryptInstance } from "@/lib/bcrypt";
import { IUser } from "../users/users.interface";
import { UserService } from "../users/users.service";
import ApiError from "@/middlewares/error";
import { Types } from "mongoose";
import { JwtInstance } from "@/lib/jwt";
import { HttpStatusCode } from "@/lib/httpStatus";
import { ILoginPayload, ILoginResponse } from "@/interfaces/common.interface";

class Service {
  async register(data: IUser) {
    data.password = await BcryptInstance.hash(data.password);

    await UserService.create(data);
  }

  async login(data: ILoginPayload): Promise<ILoginResponse> {
    const user = await UserService.getUserByEmailWithPassword(data.email);

    if (!user) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, "Invalid credentials");
    }

    const isPasswordMatched = await BcryptInstance.compare(
      data.password,
      user.password
    );

    if (!isPasswordMatched) {
      throw new ApiError(
        HttpStatusCode.UNAUTHORIZED,
        "Invalid credentials. Please try with valid credentials"
      );
    }

    return await this.generateLoginCredentials(user._id as Types.ObjectId);
  }

  async getLoggedInUser(id: string) {
    const user = await UserService.getUserByIdWithoutPassword(id);

    // sanitize user data
    return user;
  }

  async generateLoginCredentials(
    id: Types.ObjectId | string
  ): Promise<ILoginResponse> {
    const user: any = await UserService.getUserByIdWithoutPassword(id);

    const payload: any = {
      id: user?._id.toString(),
      role: user?.role as string,
      email: user.email,
    };
    const { access_token, refresh_token } =
      await JwtInstance.generateTokens(payload);

    return {
      user: user,
      access_token,
      refresh_token,
    };
  }
}

export const AuthService = new Service();
