import { Job } from 'bullmq';
import { ConversionItem, ConversionStatus } from '../../db';
import { Repository } from 'typeorm';
import BullMQConversionItem from '../BullMQConversionItem';
import { convertToMp4 } from './convertFile';
import { getLoggerByName } from '../../utils/getLoggerByName';
import { FileNoLongerExistsError, InvalidJobNameError } from '../errors';
import { JobName } from '../queue/utils';

const logger = getLoggerByName("bullMQ/handleJob.ts")

const handleJob = async ({job,conversionItemRepo}:{job: Job<string>, conversionItemRepo: Repository<ConversionItem>}): Promise<void> => {
  try{
    if(job.name !== JobName.CONVERT_TO_1080_AND_ENCODE) throw new InvalidJobNameError()
    const conversionItem= await new BullMQConversionItem({job, repo: conversionItemRepo}).initalize();
    const stillExists = await conversionItem.checkIfFileStillExists()
    if (!stillExists) throw new FileNoLongerExistsError(conversionItem);
    logger.info(`🔄 Processing ${conversionItem.title}`);
    await conversionItem.update({ startedAt: new Date(), status: ConversionStatus.PROCESSING });
    await convertToMp4(conversionItem);
  }catch (error) {
    logger.error(`💥 Error processing job ${error instanceof Error ? error.message : "Unknown error"}`);
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }

}

export default handleJob;
