import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const cors_origins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const envConfig = {
  app: {
    port: process.env.PORT ? Number(process.env.PORT) : 5000,
    env: process.env.NODE_ENV as "development" | "production",
    name: process.env.APP_NAME || "Appify Social",
  },
  cors_origins,
  database: {
    mongodb_url: process.env.MONGODB_URL as string,
  },
  jwt: {
    access_token_expires: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
    refresh_token_expires: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
    secret: process.env.JWT_TOKEN_SECRET as string,
    access_cookie_name:
      process.env.ACCESS_TOKEN_COOKIE_NAME || "appify_social_access_token",
    refresh_cookie_name:
      process.env.REFRESH_TOKEN_COOKIE_NAME || "appify_social_refresh_token",
  },
  aws: {
    access_key_id: process.env.AWS_ACCESS_KEY_ID as string,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY as string,
    region: process.env.AWS_DEFAULT_REGION as string,
    bucket_name: process.env.AWS_BUCKET_NAME as string,
    file_load_base_url: process.env.AWS_FILE_LOAD_BASE_URL as string,
  },
};
