import { Response } from "express";
import { envConfig } from "../config";

class CookieManager {
  private readonly accessTokenName = envConfig.jwt.access_cookie_name;
  private readonly refreshTokenName = envConfig.jwt.refresh_cookie_name;

  private setCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    domain: ".mdrubelahmedrana.com",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
  };

  private clearCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    path: "/",
    domain: ".mdrubelahmedrana.com",
  };

  public setTokens(
    res: Response,
    accessToken: string,
    refreshToken: string
  ): void {
    res.cookie(this.accessTokenName, accessToken, this.setCookieOptions);
    res.cookie(this.refreshTokenName, refreshToken, this.setCookieOptions);
  }

  public clearTokens(res: Response): void {
    res.clearCookie(this.accessTokenName, this.clearCookieOptions);
    res.clearCookie(this.refreshTokenName, this.clearCookieOptions);
  }
}

export const cookieManager = new CookieManager();
