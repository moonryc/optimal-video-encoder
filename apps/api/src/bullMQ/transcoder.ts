import startWorker from './worker/worker';
import { DataSource } from 'typeorm';
import { startQueue } from './queue/queue';
import { startFileWatcher } from './fileWatcher/fileWatcher';
import { CONFIG } from '../config';

const transcoder = async ({ds}:{ds: DataSource}) =>{
  if(CONFIG.disableTranscoder) return;
  const {addToQueue} = startQueue(ds)
  startFileWatcher({queueFile:addToQueue})
  void startWorker({ds, reEnqueueFile:addToQueue})
}

export default transcoder
