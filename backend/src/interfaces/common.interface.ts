import { IUser } from "@/modules/users/users.interface";
import { Request } from "express";
import { Types } from "mongoose";

export type IJWtPayload = {
  id: string | Types.ObjectId;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
};

export type ILoginResponse = {
  access_token: string;
  refresh_token: string;
  user: IUser;
};

export type ILoginPayload = {
  email: string;
  password: string;
};

export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};

export interface RateLimitOptions {
  windowInSeconds: number;
  maxRequests: number;
  keyPrefix?: string;
  getKey?: (req: Request) => string;
}
