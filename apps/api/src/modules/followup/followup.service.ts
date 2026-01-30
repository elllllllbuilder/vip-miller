import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FollowUpService {
  // Buscar usuários que precisam receber follow-up
  async getPendingFollowUps() {
    const users = await prisma.userState.findMany({
      where: {
        start_seen: true,
        last_offer_shown_at: {
          not: null,
        },
        followup_count: {
          lt: 6, // Máximo de 6 follow-ups
        },
        user: {
          subscriptions: {
            none: {
              status: 'active',
            },
          },
        },
      },
      include: {
        user: true,
      },
    });

    return users.map(state => ({
      telegram_user_id: state.user.telegram_user_id,
      last_offer_shown_at: state.last_offer_shown_at,
      followup_count: state.followup_count,
      last_followup_sent_at: state.last_followup_sent_at,
    }));
  }

  // Buscar pagamentos abandonados (Pix gerado mas não pago)
  async getAbandonedPayments() {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const payments = await prisma.payment.findMany({
      where: {
        status: 'pending',
        created_at: {
          gte: oneDayAgo,
          lte: twoHoursAgo,
        },
      },
      include: {
        user: true,
      },
    });

    return payments.map(payment => ({
      telegram_user_id: payment.user.telegram_user_id,
      created_at: payment.created_at,
    }));
  }

  // Marcar follow-up como enviado
  async markFollowUpSent(telegramUserId: string) {
    const user = await prisma.user.findUnique({
      where: { telegram_user_id: telegramUserId },
    });

    if (!user) return;

    await prisma.userState.update({
      where: { user_id: user.id },
      data: {
        followup_count: {
          increment: 1,
        },
        last_followup_sent_at: new Date(),
      },
    });
  }

  // Registrar quando o usuário viu a oferta
  async markOfferShown(telegramUserId: string) {
    const user = await prisma.user.findUnique({
      where: { telegram_user_id: telegramUserId },
    });

    if (!user) return;

    await prisma.userState.upsert({
      where: { user_id: user.id },
      create: {
        user_id: user.id,
        start_seen: true,
        last_offer_shown_at: new Date(),
        followup_count: 0,
      },
      update: {
        start_seen: true,
        last_offer_shown_at: new Date(),
      },
    });
  }

  // Resetar follow-ups quando o usuário assinar
  async resetFollowUps(telegramUserId: string) {
    const user = await prisma.user.findUnique({
      where: { telegram_user_id: telegramUserId },
    });

    if (!user) return;

    await prisma.userState.update({
      where: { user_id: user.id },
      data: {
        followup_count: 0,
        last_followup_sent_at: null,
        last_offer_shown_at: null,
      },
    });
  }
}
