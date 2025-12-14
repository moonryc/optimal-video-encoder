import path from "path";
import fs from "fs";

enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

const fileName = "optimal-video-encoder.log"

export const getLoggerByName = (name: string) => {

  const log = (message: string, { logLevel = 'error' }) => {
    const date = new Date().toISOString();
    const logMessage = `[${date}] [${name}] [${logLevel}]: ${message}`
    //every log should be saved to a log file called convert-tv-and-movies.log
    if (!fs.existsSync(path.join(process.cwd(), fileName))) {
      fs.writeFileSync(path.join(process.cwd(), fileName), '');
    }
    //each message should be on a new line
    fs.appendFileSync(path.join(process.cwd(), fileName), logMessage + '\n');
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
