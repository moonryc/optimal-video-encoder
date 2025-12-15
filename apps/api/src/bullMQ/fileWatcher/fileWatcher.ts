import { ConversionItem } from '../../db';
import chokidar from 'chokidar';
import { CONFIG } from '../../config';
import { getLoggerByName } from '../../utils/getLoggerByName';

const logger = getLoggerByName('fileWatcher.ts');

export const startFileWatcher = ({queueFile}:{queueFile: (path:ConversionItem["path"])=>Promise<void>}) => {
  if(CONFIG.disableFileWatch) return logger.warn("🚫 FILE WATCH DISABLED");

  chokidar.watch(CONFIG.locationConfig.watchDirectory, {
    persistent: true,
    awaitWriteFinish: true,
  }).on("add", async (filePath:string) => {
    const validExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.ts', '.webm'];
    const normalizedPath = filePath.toLowerCase();
    if (!validExtensions.some(extension => normalizedPath.endsWith(extension))) {
      logger.info(`👀 Ignoring non-supported file: ${filePath}`);
      return;
    }
    await queueFile(filePath);
  })
}


