import { Queue, Worker } from 'bullmq';
import { createRedisConnection } from './redis';

const connection = createRedisConnection();

export const renewalQueue = new Queue('renewals', { connection });

export function createRenewalWorker(processor: any) {
  return new Worker('renewals', processor, { connection });
}
