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

  fastify.get('/payments', async (request, reply) => {
    const { limit = 100, offset = 0 } = request.query as any;
    const payments = await paymentsService.listPayments(limit, offset);
    return reply.send({ payments });
  });
}
