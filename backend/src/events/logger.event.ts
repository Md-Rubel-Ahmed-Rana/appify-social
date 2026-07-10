import fs from "fs";
import path from "path";

import { emitter } from "./eventEmitter";
import { getLogDirectory } from "@/utils/logger.utils";

// Ensure the logs directory exists
const logDir = getLogDirectory();

emitter.on("apiLog", async (logData) => {
  const fileName = `api_data_logger_${new Date()
    .toISOString()
    .slice(0, 10)}.log`;

  const logFilePath = path.join(logDir, fileName);

  try {
    await fs.promises.appendFile(
      logFilePath,
      `${JSON.stringify(logData)}\n`,
      "utf8"
    );
  } catch (err) {
    console.error("Error writing to log file:", err);
  }
});
