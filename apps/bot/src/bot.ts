import { Bot } from 'grammy';
import { env } from './config/env';
import { TelegramClient } from './clients/telegram.client';
import { ApiClient } from './clients/api.client';
import { registerCommands } from './handlers/commands';
import { registerCallbacks } from './handlers/callbacks';
import { registerMessages } from './handlers/messages';
import { attachUser } from './middlewares/attachUser';
import { rateLimit } from './middlewares/rateLimit';

export function createBot() {
  const bot = new Bot(env.TELEGRAM_BOT_TOKEN);
  const telegramClient = new TelegramClient();
  const apiClient = new ApiClient();

  // Middlewares
  bot.use(rateLimit);
  bot.use(attachUser);

  // Handlers
  registerCommands(bot, telegramClient, apiClient);
  registerCallbacks(bot, apiClient);
  registerMessages(bot);

  // Error handler
  bot.catch((err) => {
    console.error('Bot error:', err);
  });

  return bot;
}
