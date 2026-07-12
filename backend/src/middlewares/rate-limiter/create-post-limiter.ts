import { rateLimiter } from ".";

export const createPostLimiter = rateLimiter({
  keyPrefix: "rl:create-post",
  windowInSeconds: 60,
  maxRequests: 20,
  getKey: (req) => req.user.id,
});
