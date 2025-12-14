import { ConversionItem, ConversionStatus } from '../../db';
import { getLoggerByName } from '../../utils/getLoggerByName';
import { Job, JobProgress, Worker } from 'bullmq';
import { CONFIG } from '../../config';
import handleJob from './handleJob';
import BullMQConversionItem from '../BullMQConversionItem';
import { StalledFFMPEGError } from '../errors';
import { PROGRESS_UPDATE_DEBOUNCE_MS } from './utils';
import { DataSource } from 'typeorm';

const logger = getLoggerByName('bullMQ/worker.ts');

const startWorker = async ({ds, reEnqueueFile}:{ ds: DataSource, reEnqueueFile:(path:ConversionItem["path"])=>Promise<void> }) => {
  const conversionItemRepo = ds.getRepository(ConversionItem);
  const lastProgressUpdateByJobId = new Map<string, number>();

  const worker = new Worker(
    CONFIG.redisConfig.queueName,
    async (job: Job<string>) => handleJob({ job, conversionItemRepo }),
    {
      connection: {
        host: CONFIG.redisConfig.host,
        port: CONFIG.redisConfig.port,
        password: CONFIG.redisConfig.password,
      },
      concurrency: CONFIG.redisConfig.workerConcurrency, // number of parallel ffmpeg processes
      //make the locklduration 2 hours
      lockDuration: 7200000, // 2 hours
      stalledInterval: 30000, // Check for stalled jobs every 30 seconds
      maxStalledCount: 2, // Retry stalled jobs twice before failing
    }
  );

  worker.on('completed', async (job: Job<string>) => {
    try {
      const conversionItem = await new BullMQConversionItem({
        job,
        repo: conversionItemRepo,
      }).initialize();
      await conversionItem.update({
        completedAt: new Date(),
        progress: 100,
        status: ConversionStatus.COMPLETED,
      });
      lastProgressUpdateByJobId.delete(conversionItem.path);
      logger.info(`🎉 Job ${job.id} | ${conversionItem.title} completed`);
    } catch (err: unknown) {
      logger.error(
        `💥 Error handling completed job ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    } finally {
      if (job) {
        await job.remove();
      }
    }
  });

  /**
   * @description Handles the failed job, logs the error and the stack trace
   * @param job - The job that failed, this is undefined if the job was not found. unknown as the type is not known butwill mostly be ConversionItemJobData
   * @param err - The error that occurred
   */
  worker.on(
    'failed',
    async (job: Job<string> | undefined, err: Error | StalledFFMPEGError) => {
      if (!job) {
        logger.error(
          `💥 Job failed but no job id was found | [ERROR]: ${err.message}`
        );
        return;
      }
      const conversionItem = await new BullMQConversionItem({
        job: job,
        repo: conversionItemRepo,
      }).initialize();
      let stackTraceError = `CUSTOM StackTrace: \n [ERROR]: ${job?.stacktrace?.join(
        '\n [ERROR]: '
      )}`;
      try {
        if (err instanceof StalledFFMPEGError) {
          await conversionItem.update({
            stallCounter: conversionItem.stallCounter + 1,
          });
          await conversionItem.job.remove();
          if (conversionItem.stallCounter <= 10) {
            await reEnqueueFile(conversionItem.path);
            return;
          }
          await conversionItem.cleanupMoveToDestinationDirectory();
          return;
        }
        await conversionItem.cleanupMoveToDestinationDirectory();
      } catch (err: unknown) {
        stackTraceError += `\n💥 Error handling failed job ${
          err instanceof Error ? err.message : 'Unknown error'
        }`;
      }
      logger.error(
        `💥 Job ${job?.id} | ${conversionItem.title} | \n failed: ${err.message} \n ${stackTraceError}`
      );
      try {
        logger.error(`💥 Updating conversion item status ${stackTraceError}`);
        await conversionItem.update({
          error: stackTraceError,
          erroredAt: new Date(),
          completedAt: new Date(),
          status: ConversionStatus.FAILED,
        });
      } catch (err: unknown) {
        logger.error(
          `💥 Error updating conversion item status ${
            err instanceof Error ? err.message : 'Unknown error'
          }`
        );
      }
      await job.remove();
      lastProgressUpdateByJobId.delete(conversionItem.jobId);
    }
  );

  worker.on('progress', async (job: Job<string>, progress: JobProgress) => {
    if (typeof progress !== 'number') return;
    const conversionItem = await new BullMQConversionItem({
      job: job,
      repo: conversionItemRepo,
    }).initialize();

    const now = Date.now();
    const lastUpdatedAt = lastProgressUpdateByJobId.get(conversionItem.jobId);
    if (lastUpdatedAt && now - lastUpdatedAt < PROGRESS_UPDATE_DEBOUNCE_MS)
      return;

    lastProgressUpdateByJobId.set(conversionItem.jobId, now);

    try {
      await conversionItem.update({
        progress,
        status: ConversionStatus.PROCESSING,
      });
    } catch (error) {
      lastProgressUpdateByJobId.delete(conversionItem.jobId);
      logger.error(
        `💥 Error updating job progress for ${conversionItem.jobId}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  });

  // /**
  //  * @description Handles stalled jobs - jobs that have been locked for too long without completing
  //  * This can happen when a worker crashes, loses connection, or a job takes longer than lockDuration
  //  * @param jobId - The ID of the stalled job
  //  * @param prev - The previous state of the job (what it was before stalling)
  //  */
  worker.on('stalled', async (jobId: string, prev: string) =>
    logger.error(
      `⚠️ Job ${jobId} has stalled! Previous state: ${prev}. It will be retried.`
    )
  );

  // /**
  //  * @description Handles Redis connection errors
  //  */
  worker.on('error', (err: Error) =>
    logger.error(`💥 Worker error: ${err.message}: ${err.stack}`)
  );

  logger.info(
    `✅ Worker started with concurrency: ${CONFIG.redisConfig.workerConcurrency}`
  );

  worker.on('closed', () => logger.info(`🔴 Worker closed`));
  worker.on('closing', () => logger.info(`🔄 Worker closing`));
  return worker;
};

export default startWorker
