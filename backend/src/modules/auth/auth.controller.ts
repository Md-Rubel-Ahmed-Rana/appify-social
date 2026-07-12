import BaseController from "@/shared/baseController";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { HttpStatusCode } from "@/lib/httpStatus";
import { cookieManager } from "@/shared/cookie";
import { ILoginResponse } from "@/interfaces/common.interface";

class Controller extends BaseController {
  register = this.catchAsync(async (req: Request, res: Response) => {
    const { user, access_token, refresh_token } = await AuthService.register(
      req.body
    );

    cookieManager.setTokens(res, access_token, refresh_token);

    this.sendResponse(res, {
      statusCode: HttpStatusCode.CREATED,
      success: true,
      message: `Your account has been created successfully`,
      data: user,
    });
  });

  getLoggedInUser = this.catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.getLoggedInUser(req.user?.id);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Authenticated user retrieved successfully",
      data: result,
    });
  });

  updateUserProfile = this.catchAsync(async (req: Request, res: Response) => {
    await AuthService.updateUserProfile(req.user?.id, req.body);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "User profile updated successfully",
      data: null,
    });
  });

  login = this.catchAsync(async (req: Request, res: Response) => {
    const data: any = await AuthService.login(req.body);

    const { access_token, refresh_token, user } = data as ILoginResponse;
    cookieManager.setTokens(res, access_token, refresh_token);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "User has been logged in  successfully",
      data: user,
    });
  });

  logout = this.catchAsync(async (req: Request, res: Response) => {
    cookieManager.clearTokens(res);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "User logged out successfully",
      data: null,
    });
  });
}

export const AuthController = new Controller();
