import { Job } from 'bullmq';
import { TelegramClient } from '../clients/telegram.client';

const telegramClient = new TelegramClient();

interface BroadcastData {
  message: string;
  users: string[]; // telegram_user_ids
  button?: {
    text: string;
    callback_data: string;
  };
}

export async function processBroadcast(job: Job<BroadcastData>) {
  console.log('📢 Processing broadcast...');

  const { message, users, button } = job.data;

  let sentCount = 0;
  let failedCount = 0;

  for (const userId of users) {
    try {
      const options: any = {};

      if (button) {
        options.reply_markup = {
          inline_keyboard: [[
            { text: button.text, callback_data: button.callback_data }
          ]]
        };
      }

      await telegramClient.sendMessage(userId, message, options);
      sentCount++;

      // Delay de 100ms entre mensagens para evitar rate limit
      await new Promise(resolve => setTimeout(resolve, 100));

      // Log a cada 10 mensagens
      if (sentCount % 10 === 0) {
        console.log(`📤 Sent ${sentCount}/${users.length} messages`);
      }
    } catch (error) {
      console.error(`❌ Failed to send to user ${userId}:`, error);
      failedCount++;
    }
  }

  console.log(`✅ Broadcast completed: ${sentCount} sent, ${failedCount} failed`);

  return {
    sentCount,
    failedCount,
    total: users.length,
  };
}
