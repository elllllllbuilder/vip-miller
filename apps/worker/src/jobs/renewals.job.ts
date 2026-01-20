import { Job } from 'bullmq';
import { RenewalService } from '../services/renewal.service';
import { ApiClient } from '../clients/api.client';
import { TelegramClient } from '../clients/telegram.client';

export async function processRenewalJob(job: Job) {
  const { daysAhead } = job.data;
  
  const apiClient = new ApiClient();
  const telegramClient = new TelegramClient();
  const renewalService = new RenewalService(apiClient, telegramClient);

  console.log(`Processing renewal job for D-${daysAhead}`);
  
  await renewalService.sendRenewalReminders(daysAhead);
  
  return { success: true, daysAhead };
}
