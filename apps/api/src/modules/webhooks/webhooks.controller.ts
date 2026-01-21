import { FastifyInstance, FastifyRequest } from 'fastify';
import { WebhooksService } from './webhooks.service';
import { logger } from '../../config/logger';

export async function webhooksRoutes(
  fastify: any,
  webhooksService: WebhooksService
) {
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
