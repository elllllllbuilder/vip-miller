import { PrismaClient } from '@prisma/client';

export class StateRepository {
  constructor(private prisma: PrismaClient) {}

  async findByUserId(userId: string) {
    return this.prisma.userState.findUnique({
      where: { user_id: userId },
    });
  }

  async upsert(userId: string, data: {
    start_seen?: boolean;
    current_funnel?: string;
    current_step?: number;
  }) {
    return this.prisma.userState.upsert({
      where: { user_id: userId },
      create: {
        user_id: userId,
        ...data,
        last_interaction_at: new Date(),
      },
      update: {
        ...data,
        last_interaction_at: new Date(),
      },
    });
  }

  async updateStep(userId: string, funnel: string, step: number) {
    return this.upsert(userId, {
      current_funnel: funnel,
      current_step: step,
    });
  }

  async markStartSeen(userId: string) {
    return this.upsert(userId, {
      start_seen: true,
    });
  }
}
