import ffmpeg from 'fluent-ffmpeg';
import { FOUR_K_RESOLUTION } from '../../config';

export enum JobName {
  CONVERT_TO_1080_AND_ENCODE = "convert_to_1080_and_encode",
}

/**
 * Get info of a video file such as width, height, duration, and if it's 4k
 */
export const getVideoFileInfo = (filePath: string): Promise<{ width: number, height: number, duration: number, is4k: boolean }> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      const videoStream = metadata.streams.find((s) => s.width && s.height);
      if (!videoStream) return reject(new Error("No video stream found"));
      const duration = metadata.format.duration || 0;
      if (!videoStream.width || !videoStream.height) return reject(new Error("No video stream found"));
      resolve({
        width: videoStream.width,
        height: videoStream.height,
        duration,
        is4k: videoStream.width >= FOUR_K_RESOLUTION.width && videoStream.height >= FOUR_K_RESOLUTION.height,
      });
    });
  });
}
