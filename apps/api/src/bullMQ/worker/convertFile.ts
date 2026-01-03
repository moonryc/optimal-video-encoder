import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

import { CONFIG } from '../../config';
import { MoveFileError, StalledFFMPEGError } from '../errors';
import { getLoggerByName } from '../../utils/getLoggerByName';
import BullMQConversionItem from '../BullMQConversionItem';
import { CustomJobProgress } from './utils';

const logger = getLoggerByName('convertFile.ts');

const STALL_TIMEOUT_MS = 5 * 60 * 1000;
const STALL_CHECK_INTERVAL_MS = 30 * 1000;

type FFMPEGProgress = {
  frames: number;
  currentFps: number;
  currentKbps: number;
  targetSize: number;
  timemark: string;
  percent?: number | undefined;
}

type Resolve = (value: unknown) => void;
type Reject = (error: Error) => void;

const onFFMPEGProgress = async ({ conversionItem, progress, reject }: { conversionItem: BullMQConversionItem, progress: FFMPEGProgress, reject: Reject }) => {
  try {
    if (conversionItem.duration > 0 && progress.timemark) {
      const timeParts = progress.timemark.split(":").map(Number);
      const secondsElapsed = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
      const percent = Math.min(Number(((secondsElapsed / conversionItem.duration) * 100).toFixed(1)), 100);
      const readablePercent = isNaN(percent) ? 0 : percent;
      const timeRemaining = conversionItem.duration - secondsElapsed
      const customProgress:CustomJobProgress = {
        percentage: readablePercent,
        timeRemaining,
      }
      await conversionItem.job.updateProgress(customProgress)
      if (CONFIG.logProgress) console.log(`[${conversionItem.title}] | [${conversionItem.path}] | ⏱ Progress: ${customProgress.percentage}% | Time Remaining: ${customProgress.timeRemaining}s | Frame: ${progress.frames}`);
    }
  } catch (err: unknown) {
    logger.error(`[${conversionItem.title}] | [${conversionItem.path}] | Error updating conversion item progress`);
    reject(err instanceof Error ? err : new Error("Error updating conversion item progress"));
  }
}

const onFFMPEGError = async ({ conversionItem, reject, error }: { conversionItem: BullMQConversionItem, reject: Reject, error: Error }) => {
  await conversionItem.markError(error.message);
  logger.error(`[${conversionItem.title}] | [${conversionItem.path}] | Error updating conversion item status ${error.message}`);
  reject(error);
}

const onFFMPEGEnd = async ({ conversionItem, resolve, reject }: { conversionItem: BullMQConversionItem, resolve: Resolve, reject: Reject }) => {
  try {
    //use async await to rename the file
    await fs.promises.rename(conversionItem.tempDestination, conversionItem.destinationDir);
    logger.info(`[${conversionItem.title}] | ✅ Done: ${conversionItem.destinationDir}`);
    conversionItem.cleanupOriginalDestinations();
    resolve(true);
  } catch (err: Error | unknown) {
    logger.error(`[${conversionItem.title}] | [${conversionItem.path}] | ⚠️ Failed to move file after conversion | ${err instanceof Error ? err.message : err}`);
    reject(new MoveFileError(conversionItem, err instanceof Error ? err : new Error("Unknown error")));
  }
}


export const convertToMp4 = async (conversionItem: BullMQConversionItem) => {
  return new Promise((resolve, reject) => {
    logger.info(`[${conversionItem.title}] | 🎬 Processing ${conversionItem.path} → ${conversionItem.tempDestination}`);

    ffmpeg.ffprobe(conversionItem.path, (err) => {
      if (err) {
        console.error("Error probing file:", err);
        reject(err);
        return;
      }

      // Start FFmpeg command
      const command = ffmpeg(conversionItem.path)
        // Map all video and audio, remove all subtitles
        .outputOptions(["-map 0:v:0", "-map 0:a", "-map -0:s"])
        .format("mp4");

      // Conditional video handling
      if (conversionItem.is4k) {
        // Downscale 4K → 1080p
        console.log("📉 Detected 4K video — downscaling to 1080p");
        command
          .videoCodec("libx264")
          .outputOptions([
            "-preset medium",
            "-crf 18",
            "-vf", "scale=-2:1080"
          ]);
      } else {
        // Copy video directly if not 4K
        console.log("✅ Video is not 4K — copying stream");
        command.videoCodec("copy");
      }

      // Audio:
      // Keep all tracks, preserving surround sound (5.1/7.1) when available
      // Convert to AAC (Plex friendly), high bitrate to minimize loss
      command.outputOptions(["-c:a aac", "-b:a 640k"]);

      // Remove all subtitles explicitly (no -c:s copy)
      command.outputOptions(["-sn"]);

      // Faststart for Plex streaming
      command.outputOptions(["-movflags +faststart"]);

      // Save output
      command.save(conversionItem.tempDestination);

      //manages checking for stalled
      let lastProgressTimestamp = Date.now();
      let hasSettled = false;
      let stallInterval: NodeJS.Timeout | undefined;

      const clearStallInterval = () => {
        if (stallInterval) {
          clearInterval(stallInterval);
          stallInterval = undefined;
        }
      };

      const settleWithError = (error: Error) => {
        if (hasSettled) return;
        hasSettled = true;
        clearStallInterval();
        onFFMPEGError({ conversionItem, reject, error });
      };

      const settleWithSuccess = () => {
        if (hasSettled) return;
        hasSettled = true;
        clearStallInterval();
        onFFMPEGEnd({ conversionItem, resolve, reject });
      };

      stallInterval = setInterval(() => {
        if (Date.now() - lastProgressTimestamp >= STALL_TIMEOUT_MS) {
          const stallError = new StalledFFMPEGError(conversionItem);
          try {
            command.kill("SIGKILL");
          } catch (err: unknown) {
            // command may already be stopped
          }
          logger.error(`[${conversionItem.title}] | [${conversionItem.path}] | FFMPEG process stalled, killing process`);
          settleWithError(stallError);
        }
      }, STALL_CHECK_INTERVAL_MS);

      // Progress logging
      command.on("progress", async (progress) => {
        lastProgressTimestamp = Date.now();
        await onFFMPEGProgress({ conversionItem, progress, reject });
      });

      command.on("end", () => settleWithSuccess());

      command.on("error", (error) => settleWithError(error));
    });
  });
};
