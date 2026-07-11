// proxy.ts

import { NextRequest, NextResponse } from "next/server";
import { envConfig } from "./config";

const ACCESS_COOKIE_NAME = envConfig.access_token_name;
const REFRESH_COOKIE_NAME = envConfig.refresh_token_name;

export default function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const accessToken = req.cookies.get(ACCESS_COOKIE_NAME)?.value;
  const refreshToken = req.cookies.get(REFRESH_COOKIE_NAME)?.value;

  const isAuthenticated = Boolean(accessToken || refreshToken);

  // Private Routes
  const isPrivateRoute = pathname === "/" || pathname.startsWith("/feed");

  // Auth Routes
  const isAuthRoute = pathname === "/signin" || pathname === "/signup";

  // Unauthenticated user trying to access a private page
  if (isPrivateRoute && !isAuthenticated) {
    const loginUrl = new URL("/signin", req.url);

    // Preserve original destination
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user shouldn't visit signin/signup
  if (isAuthRoute && isAuthenticated) {
    const redirect = req.nextUrl.searchParams.get("redirect") || "/";

    return NextResponse.redirect(new URL(redirect, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/feed/:path*", "/signin", "/signup"],
};
