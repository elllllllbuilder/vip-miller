import { PrismaClient } from '@prisma/client';

export class SubscriptionsRepository {
  constructor(private prisma: PrismaClient) {}

  async findActiveByUserId(userId: string) {
    return this.prisma.subscription.findFirst({
      where: {
        user_id: userId,
        status: 'active',
        expires_at: { gt: new Date() },
      },
      orderBy: { expires_at: 'desc' },
    });
  }

  async create(data: {
    user_id: string;
    plan_id: string;
    started_at: Date;
    expires_at: Date;
    status: string;
  }) {
    return this.prisma.subscription.create({ data });
  }

  async update(id: string, data: Partial<{
    status: string;
    expires_at: Date;
  }>) {
    return this.prisma.subscription.update({
      where: { id },
      data,
    });
  }

  async findExpiringBetween(startDate: Date, endDate: Date) {
    return this.prisma.subscription.findMany({
      where: {
        status: 'active',
        expires_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { user: true },
    });
  }

  async findAll(limit: number = 100, offset: number = 0) {
    return this.prisma.subscription.findMany({
      take: limit,
      skip: offset,
      orderBy: { created_at: 'desc' },
      include: { user: true },
    });
  }
}
