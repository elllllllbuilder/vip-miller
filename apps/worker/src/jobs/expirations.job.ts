import { Job } from 'bullmq';
import { RenewalService } from '../services/renewal.service';
import { ApiClient } from '../clients/api.client';
import { TelegramClient } from '../clients/telegram.client';

export async function processExpirationsJob(job: Job) {
  const apiClient = new ApiClient();
  const telegramClient = new TelegramClient();
  const renewalService = new RenewalService(apiClient, telegramClient);

  console.log('Processing expirations job');
  
  await renewalService.processExpiredSubscriptions();
  
  return { success: true };
}
