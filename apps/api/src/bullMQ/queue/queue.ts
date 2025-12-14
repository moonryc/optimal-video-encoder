import { Queue } from 'bullmq';
import { CONFIG } from '../../config';
import { DataSource } from 'typeorm';
import { getLoggerByName } from '../../utils/getLoggerByName';
import { ConversionItem } from '../../db';
import { getVideoFileInfo, JobName } from './utils';

const logger = getLoggerByName('queue');

// connect to redis
export const startQueue = (ds:DataSource) => {
  const conversionItemRepo = ds.getRepository(ConversionItem);
  const queue = new Queue(CONFIG.redisConfig.queueName, {
    connection: { host: CONFIG.redisConfig.host, port: CONFIG.redisConfig.port, password: CONFIG.redisConfig.password }
  })

  const addToQueue = async (path: ConversionItem["path"])=>{
    const {duration, is4k} = await getVideoFileInfo(path);

    const conversionItemShape = conversionItemRepo.create({
      path,
      duration,
      is4k,
    })

    const conversionItem = await conversionItemRepo.save(conversionItemShape);

    logger.info(`Enqueueing ${conversionItem.path}`)
    await queue.add(JobName.CONVERT_TO_1080_AND_ENCODE,conversionItem.id, { jobId: conversionItem.id, })
  }

  return {
    queue,
    addToQueue
  } as const
}


