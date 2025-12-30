import { ConversionItem } from '../db';

export class MissingJobIdError extends Error {
  constructor(input:ConversionItem) {
    const message = `[MISSING] JonId on file: [${input.path}]`;
    super(message);
  }
}

export class StalledFFMPEGError extends Error {
  constructor(input:ConversionItem) {
    const message = `[STALLED] FFMPEG process stalled on file: [${input.path}]`;
    super(message);
  }
}

export class ConversionItemDoesNotExistError extends Error {
  constructor(input:ConversionItem) {
    const message = `Conversion Item: [${input.path}] does not exist`;
    super(message);
  }
}

export class InvalidJobNameError extends Error {
  constructor() {
    const message = `INVALID JOB NAME`;
    super(message);
  }
}

export class MoveFileError extends Error {
  constructor(input:ConversionItem, reason:Error) {
    const message = `[COULD NOT MOVE]: [${input.path}] \n REASON: ${reason.message}`;
    super(message);
  }
}

export class FileNoLongerExistsError extends Error {
  constructor(input:ConversionItem) {
    const message = `[FILE NO LONGER EXISTS]: [${input.path}]`;
    super(message);
  }
}
