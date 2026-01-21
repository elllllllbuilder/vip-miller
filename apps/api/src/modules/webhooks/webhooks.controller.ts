import { FastifyInstance, FastifyRequest } from 'fastify';
import { WebhooksService } from './webhooks.service';
import { logger } from '../../config/logger';

export async function webhooksRoutes(
  fastify: any,
  webhooksService: WebhooksService,
  paymentsService?: any
) {
  // Endpoint simples para testar confirmação de pagamento
  fastify.post('/test/confirm-payment/:paymentId', async (request: any, reply: any) => {
    const { paymentId } = request.params;
    
    try {
      if (!paymentsService) {
        return reply.status(500).send({ error: 'PaymentsService not available' });
      }

      // Buscar o payment
      const payments = await paymentsService.listPayments(100, 0);
      const targetPayment = payments.find((p: any) => p.id === paymentId);
      
      if (!targetPayment) {
        return reply.status(404).send({ error: 'Payment not found' });
      }

      // Simular webhook
      const mockPayload = {
        event: 'cash_in.received',
        data: {
          identifier: targetPayment.provider_charge_id,
          amount: targetPayment.amount / 100,
          status: 'paid',
          payment_method: 'pix',
          metadata: {
            user_id: targetPayment.user_id,
            plan_id: targetPayment.plan_id
          }
        }
      };
      
      const result = await webhooksService.handleSyncPayWebhook(mockPayload);
      return reply.send({ success: true, result, payment: targetPayment });
    } catch (error: any) {
      logger.error({ error: error.message }, 'Test confirm payment failed');
      return reply.status(500).send({ error: error.message });
    }
  });

  // Endpoint de teste para simular webhook da SyncPay
  fastify.post('/webhooks/syncpay/test/:identifier', async (request: any, reply: any) => {
    const { identifier } = request.params;
    
    logger.info({ identifier }, '🧪 TEST: Simulating SyncPay webhook');

    const mockPayload = {
      event: 'cash_in.received',
      data: {
        identifier: identifier,
        amount: 29.9,
        status: 'paid',
        payment_method: 'pix',
        metadata: {
          user_id: 'test',
          plan_id: 'monthly_vip'
        }
      }
    };
    
    try {
      const result = await webhooksService.handleSyncPayWebhook(mockPayload);
      return reply.status(200).send({ 
        success: true, 
        message: 'Test webhook processed',
        result 
      });
    } catch (error: any) {
      logger.error({ error: error.message }, 'Test webhook failed');
      return reply.status(200).send({ 
        success: false, 
        error: error.message 
      });
    }
  });

  fastify.post('/webhooks/syncpay', async (request: any, reply: any) => {
    logger.info({ body: request.body }, 'Webhook SyncPay recebido');
    
    try {
      const result = await webhooksService.handleSyncPayWebhook(request.body);
      return reply.status(200).send({ ok: true, result });
    } catch (error: any) {
      logger.error({ error: error.message, body: request.body }, 'Webhook processing failed');
      // Sempre retornar 200 para evitar reenvios desnecessários
      return reply.status(200).send({ ok: false, error: error.message });
    }
  });
}
