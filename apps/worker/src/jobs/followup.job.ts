import { Job } from 'bullmq';
import { apiClient } from '../clients/api.client';
import { telegramClient } from '../clients/telegram.client';

interface FollowUpUser {
  telegram_user_id: string;
  last_offer_shown_at: string;
  followup_count: number;
  last_followup_sent_at: string | null;
}

interface AbandonedPayment {
  telegram_user_id: string;
  created_at: string;
}

// Configuração dos follow-ups (em horas)
const FOLLOWUP_SCHEDULE = [
  { hours: 24, message: 1 },   // 1 dia depois
  { hours: 72, message: 2 },   // 3 dias depois
  { hours: 168, message: 3 },  // 7 dias depois
];

export async function processFollowUps(job: Job) {
  console.log('🔄 Processing follow-ups...');

  try {
    // 1. Buscar usuários que viram a oferta mas não assinaram
    const usersToFollowUp = await apiClient.get<FollowUpUser[]>('/followup/pending');

    for (const user of usersToFollowUp) {
      const hoursSinceOffer = getHoursSince(user.last_offer_shown_at);
      const nextFollowUp = FOLLOWUP_SCHEDULE[user.followup_count];

      if (!nextFollowUp) {
        // Já enviou todos os follow-ups
        continue;
      }

      if (hoursSinceOffer >= nextFollowUp.hours) {
        // Hora de enviar o próximo follow-up
        await sendFollowUpMessage(user.telegram_user_id, nextFollowUp.message);
        
        // Atualizar contador no banco
        await apiClient.post('/followup/mark-sent', {
          telegram_user_id: user.telegram_user_id,
        });

        console.log(`✅ Follow-up ${nextFollowUp.message} sent to user ${user.telegram_user_id}`);
      }
    }

    // 2. Buscar pagamentos abandonados (Pix gerado mas não pago)
    const abandonedPayments = await apiClient.get<AbandonedPayment[]>('/followup/abandoned-payments');

    for (const payment of abandonedPayments) {
      const hoursSinceCreated = getHoursSince(payment.created_at);

      if (hoursSinceCreated >= 2 && hoursSinceCreated < 24) {
        // Enviar lembrete de pagamento abandonado
        await sendAbandonedPaymentMessage(payment.telegram_user_id);
        
        console.log(`✅ Abandoned payment reminder sent to user ${payment.telegram_user_id}`);
      }
    }

    console.log('✅ Follow-ups processed successfully');
  } catch (error) {
    console.error('❌ Error processing follow-ups:', error);
    throw error;
  }
}

async function sendFollowUpMessage(telegramUserId: string, messageNumber: number) {
  const messages = [
    {
      text: `👋 Oi! Notei que você ainda não garantiu seu acesso ao VIP.

🤔 Ficou com alguma dúvida? Estou aqui para ajudar!

O grupo VIP está crescendo rápido e o conteúdo exclusivo está cada vez melhor.

💎 Que tal garantir seu acesso agora?`,
    },
    {
      text: `🔥 Última chance de aproveitar!

Mais de 500 pessoas já estão no VIP aproveitando:
• Conteúdo exclusivo diário
• Comunidade engajada
• Suporte direto

Por apenas R$ 29,90/mês você não fica de fora!

⏰ Não deixe para depois, garanta agora!`,
    },
    {
      text: `💰 OFERTA ESPECIAL!

Vi que você ainda não entrou no VIP...

Que tal uma última chance? 

Clique abaixo e garanta seu acesso ao melhor conteúdo exclusivo!

🚀 Não perca mais tempo!`,
    },
  ];

  const message = messages[messageNumber - 1];
  
  await telegramClient.sendMessage(telegramUserId, message.text, {
    reply_markup: {
      inline_keyboard: [[
        { text: '💎 Assinar VIP - R$ 29,90/mês', callback_data: 'subscribe_monthly' }
      ]]
    }
  });
}

async function sendAbandonedPaymentMessage(telegramUserId: string) {
  const text = `💳 Opa! Vi que você gerou um Pix mas ainda não pagou...

O código Pix expira em breve! ⏰

Quer que eu gere um novo código para você?

Clique no botão abaixo:`;

  await telegramClient.sendMessage(telegramUserId, text, {
    reply_markup: {
      inline_keyboard: [[
        { text: '💎 Gerar Novo Pix', callback_data: 'subscribe_monthly' }
      ]]
    }
  });
}

function getHoursSince(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return diffMs / (1000 * 60 * 60);
}
