import { FastifyInstance } from 'fastify';
import { PaymentsService } from './payments.service';
import { UsersService } from '../users/users.service';
import { validateSchema } from '../../shared/http/validation';
import { CreatePixPaymentSchema } from '@vip-system/shared/src/types/api';

export async function paymentsRoutes(
  fastify: any,
  paymentsService: PaymentsService,
  usersService: UsersService
) {
  fastify.post('/payments/pix', async (request, reply) => {
    const body = validateSchema(CreatePixPaymentSchema, request.body);
    
    const user = await usersService.getUserByTelegramId(body.telegram_user_id);
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    const result = await paymentsService.createPixPayment(user.id, body.plan_id);
    
    return reply.status(201).send(result);
  });

  // Mock payment confirmation endpoint for testing
  fastify.post('/payments/mock-confirm/:telegramUserId', async (request, reply) => {
    const { telegramUserId } = request.params as any;
    
    if (process.env.SYNCPAY_MOCK_MODE !== 'true') {
      return reply.status(403).send({ error: 'Mock mode not enabled' });
    }

    const user = await usersService.getUserByTelegramId(telegramUserId);
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    // Buscar o último payment pending deste usuário
    const payments = await paymentsService.listPayments(1, 0);
    const userPayment = payments.find(p => p.user_id === user.id && p.status === 'pending');
    
    if (!userPayment) {
      return reply.status(404).send({ error: 'No pending payment found for user' });
    }

    // Simular webhook de confirmação
    const mockWebhookUrl = `${process.env.API_URL}/webhooks/syncpay/mock/${userPayment.provider_charge_id}`;
    
    try {
      // Fazer uma requisição para o próprio webhook mock
      const axios = require('axios');
      const webhookResponse = await axios.post(mockWebhookUrl);
      
      return reply.send({
        success: true,
        message: 'Mock payment confirmed',
        payment_id: userPayment.id,
        webhook_response: webhookResponse.data
      });
    } catch (error: any) {
      return reply.status(500).send({ 
        error: 'Failed to trigger mock webhook',
        details: error.message 
      });
    }
  });

  fastify.get('/payments', async (request, reply) => {
    const { limit = 100, offset = 0 } = request.query as any;
    const payments = await paymentsService.listPayments(limit, offset);
    return reply.send({ payments });
  });
}
