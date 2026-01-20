import { Bot, Context } from 'grammy';

export function registerMessages(bot: Bot) {
  bot.on('message:text', async (ctx: Context) => {
    // Resposta padrão para mensagens não reconhecidas
    await ctx.reply(
      'Desculpe, não entendi. Use /start para começar ou /help para ver os comandos disponíveis.'
    );
  });
}
