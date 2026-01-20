import { PrismaClient } from '@prisma/client';

export class PaymentsRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    user_id: string;
    plan_id: string;
    amount: number;
    status: string;
    provider: string;
    provider_charge_id: string;
    pix_copy_paste?: string;
    pix_qr_code?: string;
  }) {
    return this.prisma.payment.create({ data });
  }

  async findByProviderChargeId(providerChargeId: string) {
    return this.prisma.payment.findUnique({
      where: { provider_charge_id: providerChargeId },
      include: { user: true },
    });
  }

  async update(id: string, data: Partial<{
    status: string;
    subscription_id: string;
    paid_at: Date;
  }>) {
    return this.prisma.payment.update({
      where: { id },
      data,
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.payment.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  async findAll(limit: number = 100, offset: number = 0) {
    return this.prisma.payment.findMany({
      take: limit,
      skip: offset,
      orderBy: { created_at: 'desc' },
      include: { user: true },
    });
  }
}
