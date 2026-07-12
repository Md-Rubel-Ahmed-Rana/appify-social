import { rateLimiter } from ".";

export const registerLimiter = rateLimiter({
  keyPrefix: "rl:register",
  windowInSeconds: 60 * 60,
  maxRequests: 5,
});
