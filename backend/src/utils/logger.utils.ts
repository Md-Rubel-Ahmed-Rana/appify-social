import fs from "fs";
import path from "path";

export const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, {
      recursive: true,
    });
  }
};

export const getLogDirectory = () => {
  const logDir = path.join(process.cwd(), "logs");

  ensureDirectoryExists(logDir);

  return logDir;
};
