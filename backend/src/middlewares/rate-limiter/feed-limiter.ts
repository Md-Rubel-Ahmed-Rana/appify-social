import { rateLimiter } from ".";

export const feedLimiter = rateLimiter({
  keyPrefix: "rl:feed",
  windowInSeconds: 60,
  maxRequests: 100,
  getKey: (req) => req.user.id,
});
