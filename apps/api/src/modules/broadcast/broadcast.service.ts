import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BroadcastService {
  // Buscar todos os usuários que já deram /start
  async getAllUsers() {
    const users = await prisma.user.findMany({
      select: {
        telegram_user_id: true,
        username: true,
        first_name: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return users;
  }

  // Buscar apenas usuários que NÃO são VIP
  async getNonVipUsers() {
    const users = await prisma.user.findMany({
      where: {
        subscriptions: {
          none: {
            status: 'active',
          },
        },
      },
      select: {
        telegram_user_id: true,
        username: true,
        first_name: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return users;
  }

  // Buscar apenas usuários VIP ativos
  async getVipUsers() {
    const users = await prisma.user.findMany({
      where: {
        subscriptions: {
          some: {
            status: 'active',
          },
        },
      },
      select: {
        telegram_user_id: true,
        username: true,
        first_name: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return users;
  }

  // Buscar usuários que já expiraram
  async getExpiredUsers() {
    const users = await prisma.user.findMany({
      where: {
        subscriptions: {
          some: {
            status: 'expired',
          },
          none: {
            status: 'active',
          },
        },
      },
      select: {
        telegram_user_id: true,
        username: true,
        first_name: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return users;
  }

  // Registrar broadcast enviado
  async logBroadcast(data: {
    message: string;
    target: string;
    total_users: number;
    sent_count: number;
    failed_count: number;
  }) {
    // Você pode criar uma tabela de logs se quiser
    console.log('Broadcast sent:', data);
  }
}
