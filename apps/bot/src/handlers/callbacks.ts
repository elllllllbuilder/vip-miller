import { Bot, Context } from 'grammy';
import { ApiClient } from '../clients/api.client';
import { getPaymentKeyboard } from '../ui/keyboards';
import { env } from '../config/env';

export function registerCallbacks(bot: Bot, apiClient: ApiClient) {
  const mockMode = process.env.SYNCPAY_MOCK_MODE === 'true';
  
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

      const mockText = mockMode ? '\n\n🧪 MODO TESTE ATIVO' : '';

      await ctx.reply(
        `💳 Pagamento gerado!${mockText}

Valor: R$ ${(payment.amount / 100).toFixed(2)}

📋 Copie o código Pix abaixo:

\`${payment.pix_copy_paste}\`

Após pagar, você receberá automaticamente o link de acesso ao grupo VIP!`,
        {
          parse_mode: 'Markdown',
          reply_markup: getPaymentKeyboard(mockMode),
        }
      );

      // Salvar o payment_id no contexto para usar no mock
      if (mockMode) {
        // Armazenar temporariamente o charge_id para o mock
        (ctx as any).session = { lastChargeId: payment.payment_id };
      }
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

  // Mock payment confirmation for testing
  bot.callbackQuery('payment:mock_confirm', async (ctx: Context) => {
    if (!mockMode) {
      await ctx.answerCallbackQuery('Mock mode não está ativo');
      return;
    }

    await ctx.answerCallbackQuery('Confirmando pagamento mock...');

    try {
      // Buscar o último payment criado para este usuário
      const response = await apiClient.mockConfirmPayment(ctx.from!.id.toString());
      
      await ctx.reply(
        '🧪 Pagamento MOCK confirmado com sucesso!\n\nVocê deve receber o link do grupo VIP em breve.'
      );
    } catch (error: any) {
      console.error('Error confirming mock payment:', error);
      await ctx.reply(
        '❌ Erro ao confirmar pagamento mock. Verifique os logs da API.'
      );
    }
  });
}
