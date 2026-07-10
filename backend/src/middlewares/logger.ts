import { emitter } from "@/events/eventEmitter";
import { Request, Response, NextFunction } from "express";
import { envConfig } from "../config";
import { TraceService } from "@/lib/trace";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  const originalSend = res.send;

  res.send = function (body?: any): any {
    const duration = Date.now() - startTime;

    const input = req.method === "GET" ? req.query : req.body;

    const logData = {
      timestamp: new Date().toISOString(),
      traceId: TraceService.generateAPIRequestTraceId(),
      duration,
      ip: req.ip,
      method: req.method,
      input,
      fullUrl: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
    };

    console.log(logData);

    if (envConfig.app.env === "development") {
      emitter.emitAsync("apiLog", logData);
    }

    return originalSend.call(this, body);
  };

  next();
};
