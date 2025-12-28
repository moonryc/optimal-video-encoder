import path from "path";
import fs from "fs";
import { CONFIG } from '../config';

enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

const fileName = "optimal-video-encoder.log";
const logFilePath = path.join(CONFIG.logOutputLocation, fileName);

export const getLoggerByName = (name: string) => {

  const log = (message: string, { logLevel = 'error' }) => {
    const date = new Date().toISOString();
    const logMessage = `[${date}] [${name}] [${logLevel}]: ${message}`
    // Ensure log directory exists
    if (!fs.existsSync(logFilePath)) {
      fs.mkdirSync(logFilePath, { recursive: true });
    }
    // Create log file if it doesn't exist
    if (!fs.existsSync(logFilePath)) {
      fs.writeFileSync(logFilePath, '');
    }
    // Each message should be on a new line
    fs.appendFileSync(logFilePath, logMessage + '\n');
    console.log(logMessage);
  }

  return {
    log,
    error: (message: string) => log(message, { logLevel: LogLevel.ERROR }),
    warn: (message: string) => log(message, { logLevel: LogLevel.WARN }),
    info: (message: string) => log(message, { logLevel: LogLevel.INFO }),
    debug: (message: string) => log(message, { logLevel: LogLevel.DEBUG }),
  }
}
