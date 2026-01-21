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

  async handleSyncPayWebhook(payload: any) {
    logger.info({ payload }, 'Processing SyncPay webhook');

    // Suportar tanto o formato antigo quanto o novo da SyncPay
    let event, data;
    
    if (payload.event && payload.data) {
      // Formato esperado: {event: "...", data: {...}}
      event = payload.event;
      data = payload.data;
    } else if (payload.data && payload.data.id) {
      // Formato real da SyncPay: {data: {...}}
      event = 'cash_in.received'; // assumir evento padrão
      data = payload.data;
    } else {
      logger.warn({ payload }, 'Invalid webhook format - missing event or data');
      return { success: true, message: 'Invalid format - ignored' };
    }

    // Só processar eventos de pagamento confirmado
    // SyncPay pode enviar status "paid" ou "PAID" ou outros formatos
    const isPaid = data.status && (
      data.status.toLowerCase() === 'paid' || 
      data.status.toLowerCase() === 'approved' ||
      data.status === 'PAID' ||
      data.status === 'APPROVED'
    );

    if (event !== 'cash_in.received' || !isPaid) {
      logger.info({ event, status: data.status }, 'Ignoring non-paid webhook');
      return { success: true, message: 'Ignored - not a paid event' };
    }

    const identifier = data.identifier || data.id;
    if (!identifier) {
      logger.error({ data }, 'Missing identifier in webhook data');
      return { success: true, message: 'Missing identifier - ignored' };
    }

    // Idempotência - verificar se já foi processado
    if (isProcessed(identifier)) {
      logger.info({ identifier }, 'Webhook already processed');
      return { success: true, message: 'Already processed' };
    }

    // Buscar payment pelo identifier
    const payment = await this.paymentsService.getPaymentByChargeId(identifier);
    
    if (!payment) {
      logger.error({ identifier }, 'Payment not found for identifier');
      markAsProcessed(identifier); // Marcar como processado mesmo assim
      return { success: true, message: 'Payment not found - marked as processed' };
    }

    if (payment.status === 'paid') {
      logger.info({ payment_id: payment.id }, 'Payment already marked as paid');
      markAsProcessed(identifier);
      return { success: true, message: 'Already paid' };
    }

    // Extrair user_id do metadata
    const userId = data.metadata?.user_id || payment.user_id;
    const planId = data.metadata?.plan_id || payment.plan_id;

    // Criar/renovar subscription
    const subscription = await this.subscriptionsService.createOrRenewSubscription(
      userId,
      planId
    );

    // Atualizar payment
    await this.paymentsService.confirmPayment(identifier, subscription.id);

    // Criar link de convite
    logger.info({ payment }, 'DEBUG: Payment object before telegram operations');
    
    if (!payment.user) {
      logger.error({ payment_id: payment.id }, 'Payment user not loaded');
      throw new Error('Payment user not found');
    }
    
    const telegramUserId = parseInt(payment.user.telegram_user_id);
    logger.info({ telegramUserId, telegram_user_id: payment.user.telegram_user_id }, 'DEBUG: Telegram user ID');
    
    const inviteLink = await this.telegramService.createInviteLink(telegramUserId, subscription.id);
    logger.info({ inviteLink }, 'DEBUG: Invite link created');

    // Salvar link no banco
    await this.prisma.inviteLink.create({
      data: {
        user_id: userId,
        subscription_id: subscription.id,
        invite_link: inviteLink,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // Enviar link ao usuário
    logger.info({ telegramUserId }, 'DEBUG: Sending message to user');
    const messageResult = await this.telegramService.sendMessage(
      telegramUserId,
      `🎉 Pagamento confirmado!\n\nSua assinatura VIP está ativa até ${subscription.expires_at.toLocaleDateString('pt-BR')}.\n\nClique no link abaixo para entrar no grupo VIP:\n${inviteLink}\n\n⚠️ Este link expira em 24 horas e só pode ser usado uma vez.`
    );
    logger.info({ messageResult }, 'DEBUG: Message sent result');

    markAsProcessed(identifier);
    logger.info({ payment_id: payment.id, subscription_id: subscription.id }, 'Payment processed successfully');

    return { success: true, subscription_id: subscription.id };
  }
}
