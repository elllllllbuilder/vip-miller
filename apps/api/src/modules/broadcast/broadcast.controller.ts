import { FastifyInstance } from 'fastify';
import { BroadcastService } from './broadcast.service';

const broadcastService = new BroadcastService();

export async function broadcastRoutes(app: FastifyInstance) {
  // Listar todos os usuários
  app.get('/broadcast/users/all', async (request, reply) => {
    const users = await broadcastService.getAllUsers();
    return reply.send({
      total: users.length,
      users,
    });
  });

  // Listar usuários não-VIP
  app.get('/broadcast/users/non-vip', async (request, reply) => {
    const users = await broadcastService.getNonVipUsers();
    return reply.send({
      total: users.length,
      users,
    });
  });

  // Listar usuários VIP
  app.get('/broadcast/users/vip', async (request, reply) => {
    const users = await broadcastService.getVipUsers();
    return reply.send({
      total: users.length,
      users,
    });
  });

  // Listar usuários expirados
  app.get('/broadcast/users/expired', async (request, reply) => {
    const users = await broadcastService.getExpiredUsers();
    return reply.send({
      total: users.length,
      users,
    });
  });

  // Enviar broadcast
  app.post('/broadcast/send', async (request, reply) => {
    const { message, target, button } = request.body as {
      message: string;
      target: 'all' | 'vip' | 'non-vip' | 'expired';
      button?: {
        text: string;
        callback_data: string;
      };
    };

    if (!message) {
      return reply.status(400).send({ error: 'Message is required' });
    }

    let users;
    switch (target) {
      case 'all':
        users = await broadcastService.getAllUsers();
        break;
      case 'vip':
        users = await broadcastService.getVipUsers();
        break;
      case 'non-vip':
        users = await broadcastService.getNonVipUsers();
        break;
      case 'expired':
        users = await broadcastService.getExpiredUsers();
        break;
      default:
        return reply.status(400).send({ error: 'Invalid target' });
    }

    return reply.send({
      success: true,
      message: 'Broadcast queued',
      total_users: users.length,
      users: users.map(u => u.telegram_user_id),
      button,
    });
  });
}
