export const envConfig = {
  base_api: process.env.NEXT_PUBLIC_BASE_API as string,
  access_token_name: process.env.ACCESS_TOKEN_COOKIE_NAME as string,
  refresh_token_name: process.env.REFRESH_TOKEN_COOKIE_NAME as string,
};
