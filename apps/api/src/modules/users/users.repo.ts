import { PrismaClient } from '@prisma/client';

export class UsersRepository {
  constructor(private prisma: PrismaClient) {}

  async findByTelegramId(telegramUserId: string) {
    return this.prisma.user.findUnique({
      where: { telegram_user_id: telegramUserId },
    });
  }

  async create(data: {
    telegram_user_id: string;
    username?: string;
    first_name: string;
    last_name?: string;
  }) {
    return this.prisma.user.create({ data });
  }

  async upsert(data: {
    telegram_user_id: string;
    username?: string;
    first_name: string;
    last_name?: string;
  }) {
    return this.prisma.user.upsert({
      where: { telegram_user_id: data.telegram_user_id },
      create: data,
      update: {
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
      },
    });
  }

  async findAll(limit: number = 100, offset: number = 0) {
    return this.prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: { created_at: 'desc' },
    });
  }
}
