import { Bot, Context } from 'grammy';
import { TelegramClient } from '../clients/telegram.client';
import { ApiClient } from '../clients/api.client';
import { env } from '../config/env';
import { VIP_SEQUENCE } from '../ui/messages/vip';
import { SALES_SEQUENCE_FIRST_START, SALES_SEQUENCE_RETURNING } from '../ui/messages/sales';
import { getSubscribeKeyboard } from '../ui/keyboards';

export function registerCommands(bot: Bot, telegramClient: TelegramClient, apiClient: ApiClient) {
  bot.command('start', async (ctx: Context) => {
    if (!ctx.from) return;

    const userId = ctx.from.id;
    
    // Garantir que o usuário existe no banco
    try {
      await apiClient.ensureUserExists({
        telegram_user_id: userId.toString(),
        username: ctx.from.username,
        first_name: ctx.from.first_name,
        last_name: ctx.from.last_name,
      });
    } catch (error) {
      console.error('Error ensuring user exists:', error);
    }

    const isVip = await telegramClient.isUserInChat(env.TELEGRAM_VIP_CHAT_ID, userId);

    // TODO: Verificar no banco se já viu o /start antes
    const hasSeenStart = false; // Simplificado - em produção buscar do banco

    let sequence;
    if (isVip) {
      sequence = VIP_SEQUENCE;
    } else if (!hasSeenStart) {
      sequence = SALES_SEQUENCE_FIRST_START;
    } else {
      sequence = SALES_SEQUENCE_RETURNING;
    }

    // Enviar sequência de mensagens
    for (const message of sequence) {
      const keyboard = (message as any).keyboard === 'subscribe' ? getSubscribeKeyboard() : undefined;
      
      await ctx.reply(message.text, {
        reply_markup: keyboard,
      });

      // Pequeno delay entre mensagens
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  });

  bot.command('help', async (ctx: Context) => {
    await ctx.reply(
      `🤖 Comandos disponíveis:

/start - Iniciar conversa
/help - Ver esta mensagem

Para assinar o VIP, use /start e clique no botão de assinatura!`
    );
  });
}
