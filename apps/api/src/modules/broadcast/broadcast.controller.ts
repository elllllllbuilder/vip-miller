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

    // Enviar mensagens via Telegram
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const baseUrl = `https://api.telegram.org/bot${telegramToken}`;
    
    let sentCount = 0;
    let failedCount = 0;

    for (const user of users) {
      try {
        const payload: any = {
          chat_id: user.telegram_user_id,
          text: message,
        };

        if (button) {
          payload.reply_markup = {
            inline_keyboard: [[
              { text: button.text, callback_data: button.callback_data }
            ]]
          };
        }

        const response = await fetch(`${baseUrl}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          sentCount++;
        } else {
          failedCount++;
        }

        // Delay de 100ms entre mensagens para evitar rate limit
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to send to user ${user.telegram_user_id}:`, error);
        failedCount++;
      }
    }

    return reply.send({
      success: true,
      message: 'Broadcast sent',
      total_users: users.length,
      sent: sentCount,
      failed: failedCount,
    });
  });
}
