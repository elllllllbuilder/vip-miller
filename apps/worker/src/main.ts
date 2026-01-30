import { renewalQueue, createRenewalWorker } from './queues/queues';
import { processRenewalJob } from './jobs/renewals.job';
import { processExpirationsJob } from './jobs/expirations.job';
import { processFollowUps } from './jobs/followup.job';
import { Job } from 'bullmq';

async function start() {
  console.log('🔧 Worker starting...');

  // Criar worker para processar jobs
  const worker = createRenewalWorker(async (job: Job) => {
    if (job.name === 'renewal-reminder') {
      return processRenewalJob(job);
    } else if (job.name === 'process-expirations') {
      return processExpirationsJob(job);
    } else if (job.name === 'process-followups') {
      return processFollowUps(job);
    }
  });

  worker.on('completed', (job: Job) => {
    console.log(`✅ Job ${job.id} completed`);
  });

  worker.on('failed', (job: Job | undefined, err: Error) => {
    console.error(`❌ Job ${job?.id} failed:`, err);
  });

  // Agendar jobs recorrentes (1x por dia às 10h)
  await renewalQueue.add(
    'renewal-reminder',
    { daysAhead: 7 },
    {
      repeat: {
        pattern: '0 10 * * *', // Cron: 10h todos os dias
      },
    }
  );

  await renewalQueue.add(
    'renewal-reminder',
    { daysAhead: 3 },
    {
      repeat: {
        pattern: '0 10 * * *',
      },
    }
  );

  await renewalQueue.add(
    'renewal-reminder',
    { daysAhead: 1 },
    {
      repeat: {
        pattern: '0 10 * * *',
      },
    }
  );

  await renewalQueue.add(
    'process-expirations',
    {},
    {
      repeat: {
        pattern: '0 11 * * *', // 11h todos os dias
      },
    }
  );

  // Job de follow-up (roda a cada 5 minutos para testes rápidos)
  await renewalQueue.add(
    'process-followups',
    {},
    {
      repeat: {
        pattern: '*/5 * * * *', // A cada 5 minutos
      },
    }
  );

  console.log('✅ Worker is running and jobs are scheduled!');
  console.log('📅 Renewal reminders: Daily at 10:00 AM (D-7, D-3, D-1)');
  console.log('📅 Process expirations: Daily at 11:00 AM');
  console.log('📅 Follow-ups: Every 5 minutes');
}

start().catch((error) => {
  console.error('Failed to start worker:', error);
  process.exit(1);
});
