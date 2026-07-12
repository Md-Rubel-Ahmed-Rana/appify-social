import { RedisClient } from "@/config/redis";
import { RateLimitOptions } from "@/interfaces/common.interface";
import { Request, Response, NextFunction } from "express";

export const rateLimiter = (options: RateLimitOptions) => {
  const { windowInSeconds, maxRequests, keyPrefix = "rl", getKey } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const identifier = getKey?.(req) ?? req.ip!;
      const key = `${keyPrefix}:${identifier}`;

      const pipeline = RedisClient.multi();

      pipeline.incr(key);
      pipeline.expire(key, windowInSeconds);

      const results = await pipeline.exec();

      if (!results) {
        return next();
      }

      const requests = Number(results[0]);

      const remaining = Math.max(0, maxRequests - requests);

      res.setHeader("RateLimit-Limit", maxRequests);
      res.setHeader("RateLimit-Remaining", remaining);
      res.setHeader("RateLimit-Policy", `${maxRequests};w=${windowInSeconds}`);

      if (requests > maxRequests) {
        const ttl = await RedisClient.ttl(key);

        res.setHeader("RateLimit-Reset", ttl);
        res.setHeader("Retry-After", ttl);

        return res.status(429).json({
          success: false,
          statusCode: 429,
          message: "Too many requests. Please try again later.",
          retryAfter: ttl,
        });
      }

      next();
    } catch (error) {
      console.error({
        message: "Rate limiter failed",
        error,
        ip: req.ip,
        path: req.originalUrl,
      });

      next();
    }
  };
};
