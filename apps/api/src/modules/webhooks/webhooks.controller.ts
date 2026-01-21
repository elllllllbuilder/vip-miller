import { FastifyInstance, FastifyRequest } from 'fastify';
import { WebhooksService } from './webhooks.service';
import { validateWebhookSignature } from '@vip-system/sdk-syncpay/src/signature';
import { env } from '../../config/env';
import { validateSchema } from '../../shared/http/validation';
import { SyncPayWebhookSchema } from '@vip-system/shared/src/types/api';
import { logger } from '../../config/logger';

export async function webhooksRoutes(
  fastify: any,
  webhooksService: WebhooksService
) {
  fastify.post('/webhooks/syncpay', async (request: any, reply: any) => {
    const signature = request.headers['x-syncpay-signature'] as string;
    
    if (!signature) {
      logger.warn('Missing webhook signature');
      return reply.status(401).send({ error: 'Missing signature' });
    }

    const rawBody = JSON.stringify(request.body);
    const isValid = validateWebhookSignature(rawBody, signature, env.SYNCPAY_WEBHOOK_SECRET);

    if (!isValid) {
      logger.warn('Invalid webhook signature');
      return reply.status(401).send({ error: 'Invalid signature' });
    }

    const payload = validateSchema(SyncPayWebhookSchema, request.body);
    
    try {
      const result = await webhooksService.handleSyncPayWebhook(payload);
      return reply.send(result);
    } catch (error: any) {
      logger.error({ error: error.message }, 'Webhook processing failed');
      return reply.status(500).send({ error: 'Processing failed' });
    }
  });
}
