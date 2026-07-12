import { rateLimiter } from ".";

export const loginLimiter = rateLimiter({
  keyPrefix: "rl:login",
  windowInSeconds: 15 * 60,
  maxRequests: 10,
});
