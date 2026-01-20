import { PrismaClient } from '@prisma/client';

export class InvitesService {
  constructor(private prisma: PrismaClient) {}

  async createInviteLink(data: {
    user_id: string;
    subscription_id: string;
    invite_link: string;
    expires_at: Date;
  }) {
    return this.prisma.inviteLink.create({ data });
  }

  async markAsUsed(inviteLinkId: string) {
    return this.prisma.inviteLink.update({
      where: { id: inviteLinkId },
      data: { used: true },
    });
  }

  async findBySubscriptionId(subscriptionId: string) {
    return this.prisma.inviteLink.findMany({
      where: { subscription_id: subscriptionId },
      orderBy: { created_at: 'desc' },
    });
  }
}
