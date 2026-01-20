import { Bot, Context } from 'grammy';
import { ApiClient } from '../clients/api.client';
import { getPaymentKeyboard } from '../ui/keyboards';

export function registerCallbacks(bot: Bot, apiClient: ApiClient) {
  bot.callbackQuery(/^subscribe:(.+)$/, async (ctx: Context) => {
    if (!ctx.from || !ctx.callbackQuery) return;

    const planId = ctx.match?.[1];
    if (!planId) return;

    await ctx.answerCallbackQuery('Gerando pagamento...');

    try {
      const payment = await apiClient.createPixPayment(
        ctx.from.id.toString(),
        planId
      );

      await ctx.reply(
        `💳 Pagamento gerado!

Valor: R$ ${(payment.amount / 100).toFixed(2)}

📋 Copie o código Pix abaixo:

\`${payment.pix_copy_paste}\`

Após pagar, você receberá automaticamente o link de acesso ao grupo VIP!`,
        {
          parse_mode: 'Markdown',
          reply_markup: getPaymentKeyboard(),
        }
      );
    } catch (error: any) {
      console.error('Error creating payment:', error);
      await ctx.reply(
        '❌ Erro ao gerar pagamento. Tente novamente em alguns instantes.'
      );
    }
  });

  bot.callbackQuery('payment:check', async (ctx: Context) => {
    await ctx.answerCallbackQuery(
      'Aguarde a confirmação do pagamento. Você receberá o link automaticamente!',
      { show_alert: true }
    );
  });
}
