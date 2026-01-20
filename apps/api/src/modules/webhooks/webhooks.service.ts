import { PaymentsService } from '../payments/payments.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { TelegramService } from '../telegram/telegram.service';
import { PrismaClient } from '@prisma/client';
import { logger } from '../../config/logger';
import { isProcessed, markAsProcessed } from '../../shared/utils/idempotency';

export class WebhooksService {
  constructor(
    private paymentsService: PaymentsService,
    private subscriptionsService: SubscriptionsService,
    private telegramService: TelegramService,
    private prisma: PrismaClient
  ) {}

  async handleSyncPayWebhook(payload: {
    event: string;
    charge_id: string;
    status: string;
    paid_at?: string;
  }) {
    // Idempotência
    if (isProcessed(payload.charge_id)) {
      logger.info({ charge_id: payload.charge_id }, 'Webhook already processed');
      return { success: true, message: 'Already processed' };
    }

    if (payload.event !== 'charge.paid' || payload.status !== 'paid') {
      logger.info({ payload }, 'Ignoring non-paid webhook');
      return { success: true, message: 'Ignored' };
    }

    const payment = await this.paymentsService.getPaymentByChargeId(payload.charge_id);
    
    if (!payment) {
      logger.error({ charge_id: payload.charge_id }, 'Payment not found');
      throw new Error('Payment not found');
    }

    if (payment.status === 'paid') {
      logger.info({ payment_id: payment.id }, 'Payment already marked as paid');
      markAsProcessed(payload.charge_id);
      return { success: true, message: 'Already paid' };
    }

    // Criar/renovar subscription
    const subscription = await this.subscriptionsService.createOrRenewSubscription(
      payment.user_id,
      payment.plan_id
    );

    // Atualizar payment
    await this.paymentsService.confirmPayment(payload.charge_id, subscription.id);

    // Criar link de convite
    const telegramUserId = parseInt(payment.user.telegram_user_id);
    const inviteLink = await this.telegramService.createInviteLink(telegramUserId, subscription.id);

    // Salvar link no banco
    await this.prisma.inviteLink.create({
      data: {
        user_id: payment.user_id,
        subscription_id: subscription.id,
        invite_link: inviteLink,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // Enviar link ao usuário
    await this.telegramService.sendMessage(
      telegramUserId,
      `🎉 Pagamento confirmado!\n\nSua assinatura VIP está ativa até ${subscription.expires_at.toLocaleDateString('pt-BR')}.\n\nClique no link abaixo para entrar no grupo VIP:\n${inviteLink}\n\n⚠️ Este link expira em 24 horas e só pode ser usado uma vez.`
    );

    markAsProcessed(payload.charge_id);
    logger.info({ payment_id: payment.id, subscription_id: subscription.id }, 'Payment processed successfully');

    return { success: true, subscription_id: subscription.id };
  }
}
