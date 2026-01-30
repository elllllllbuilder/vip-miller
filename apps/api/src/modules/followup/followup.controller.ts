import { FastifyInstance } from 'fastify';
import { FollowUpService } from './followup.service';

const followUpService = new FollowUpService();

export async function followUpRoutes(app: FastifyInstance) {
  // Buscar usuários pendentes de follow-up
  app.get('/followup/pending', async (request, reply) => {
    const users = await followUpService.getPendingFollowUps();
    return reply.send(users);
  });

  // Buscar pagamentos abandonados
  app.get('/followup/abandoned-payments', async (request, reply) => {
    const payments = await followUpService.getAbandonedPayments();
    return reply.send(payments);
  });

  // Marcar follow-up como enviado
  app.post('/followup/mark-sent', async (request, reply) => {
    const { telegram_user_id } = request.body as { telegram_user_id: string };
    await followUpService.markFollowUpSent(telegram_user_id);
    return reply.send({ success: true });
  });

  // Marcar oferta como mostrada
  app.post('/followup/mark-offer-shown', async (request, reply) => {
    const { telegram_user_id } = request.body as { telegram_user_id: string };
    await followUpService.markOfferShown(telegram_user_id);
    return reply.send({ success: true });
  });

  // Resetar follow-ups (quando usuário assinar)
  app.post('/followup/reset', async (request, reply) => {
    const { telegram_user_id } = request.body as { telegram_user_id: string };
    await followUpService.resetFollowUps(telegram_user_id);
    return reply.send({ success: true });
  });
}
