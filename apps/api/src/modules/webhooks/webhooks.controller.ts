import { FastifyInstance, FastifyRequest } from 'fastify';
import { WebhooksService } from './webhooks.service';
import { logger } from '../../config/logger';

export async function webhooksRoutes(
  fastify: any,
  webhooksService: WebhooksService
) {
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
