import { ConversionItem } from '../db';
import { Job } from 'bullmq';
import { QueryDeepPartialEntity, Repository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import { CONFIG } from '../config';
import { getLoggerByName } from '../utils/getLoggerByName';
import { ConversionItemDoesNotExistError, MissingJobIdError } from './errors';
import { ConversionStatus } from '@org/models';
import { CustomJobProgress } from './worker/utils';


export default class BullMQConversionItem extends ConversionItem {
  public readonly job: Job<string>;
  public readonly repo: Repository<ConversionItem>;
  constructor(input: { job: Job<string>; repo: Repository<ConversionItem> }) {
    super();
    this.job = input.job;
    this.repo = input.repo;
  }

  private get logger() {
    return getLoggerByName(`conversion-item-${this.job.id}`);
  }

  get title() {
    const titleWithFileType = this.path.split('/').pop();
    if (!titleWithFileType) throw new Error('Missing title');
    return titleWithFileType;
  }

  async checkIfFileStillExists() {
    if (!fs.existsSync(this.path)) {
      await this.update({
        error: 'File no longer exists',
        erroredAt: new Date(),
        completedAt: new Date(),
        status: ConversionStatus.FAILED,
      });
      return false;
    }
    return true;
  }

  public cleanupOriginalDestinations() {
    if (!CONFIG.cleanupOriginals) return;
    fs.unlink(this.path, async (err) => {
      if (err) {
        this.logger.error(
          `[${this.title}] | [${this.path}] | Failed to delete original: ${err.message}`
        );
        await this.update({
          error: `Failed to delete original: \n ${err.message}`,
          erroredAt: new Date(),
          completedAt: new Date(),
        });
      } else {
        this.logger.info(`[${this.title}] | [${this.path}] | Original deleted`);
      }
    });
  }

  public get destinationDir(): string {
    const parsed = path.parse(this.path);
    const destDir = path.join(CONFIG.locationConfig.destination, this.title);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    return path.join(destDir, parsed.name + '.mp4');
  }

  public get tempDestination(): string {
    const parsed = path.parse(this.path);
    const showName = path.basename(path.dirname(this.path));
    const tempDir = path.join(CONFIG.locationConfig.tempDestination, showName);

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    return path.join(tempDir, parsed.name + '.mp4');
  }

  public async cleanupMoveToDestinationDirectory() {
    if (!CONFIG.cleanupOriginals) return;
    await fs.promises.rename(this.path, this.destinationDir);
  }

  get jobId(): string {
    if (!this.job.id) throw new MissingJobIdError(this);
    return this.job.id;
  }

  async initialize() {
    const ci = await this.repo.findOne({ where: { id: this.jobId } });
    if (!ci) throw new ConversionItemDoesNotExistError(this);
    Object.assign(this, ci);
    return this;
  }

  private async update(input: QueryDeepPartialEntity<ConversionItem>) {
    await this.repo.update(this.jobId, input);
  }

  async markBeginProcessing(){
    await this.update({ startedAt: new Date(), status: ConversionStatus.PROCESSING } )
  }

  async markComplete() {
    await this.update({
      completedAt: new Date(),
      progress: 100,
      status: ConversionStatus.COMPLETED,
      timeRemaining: 0,
    });
  }

  async markFailed(error: string) {
    await this.update({
      error,
      timeRemaining: 0,
      erroredAt: new Date(),
      completedAt: new Date(),
      status: ConversionStatus.FAILED,
    })
  }

  async markError(error: string) {
    await this.update({
      erroredAt: new Date(),
      completedAt: new Date(),
      status: ConversionStatus.FAILED,
      error,
    })
  }

  async updateProgress({percentage, timeRemaining}:CustomJobProgress) {
    if (percentage === 100) {
      await this.markComplete();
      return;
    }
    await this.update({ progress:percentage, timeRemaining });
  }

  async increaseStallCounter(){
    await this.update({
      stallCounter: this.stallCounter + 1,
      timeRemaining: 0,
    })
  }

}
