import startWorker from './worker/worker';
import { DataSource } from 'typeorm';
import { startQueue } from './queue/queue';
import { startFileWatcher } from './fileWatcher/fileWatcher';

const transcoder = async ({ds}:{ds: DataSource}) =>{
  const {addToQueue} = startQueue(ds)
  startFileWatcher({queueFile:addToQueue})
  void startWorker({ds, reEnqueueFile:addToQueue})
}

export default transcoder
