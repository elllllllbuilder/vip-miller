import { Job } from 'bullmq';
import { ApiClient } from '../clients/api.client';
import { TelegramClient } from '../clients/telegram.client';

const apiClient = new ApiClient();
const telegramClient = new TelegramClient();

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

// Configuração dos follow-ups (em minutos para testes rápidos)
const FOLLOWUP_SCHEDULE = [
  { minutes: 2, message: 1 },    // 2 minutos depois
  { minutes: 10, message: 2 },   // 10 minutos depois
  { minutes: 30, message: 3 },   // 30 minutos depois
  { minutes: 1440, message: 4 }, // 24 horas (1440 min)
  { minutes: 2880, message: 5 }, // 48 horas (2880 min)
  { minutes: 4320, message: 6 }, // 72 horas (4320 min)
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

      const minutesSinceOffer = getMinutesSince(user.last_offer_shown_at);
      
      if (minutesSinceOffer >= nextFollowUp.minutes) {
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

💎 Que tal garantir seu acesso agora?`,
    },
    {
      text: `🔥 Não perca essa oportunidade!

O grupo VIP está crescendo rápido e o conteúdo exclusivo está cada vez melhor.

Por apenas R$ 29,90/mês você tem acesso a tudo!

⏰ Garanta agora!`,
    },
    {
      text: `💰 Última chance de aproveitar!

Mais de 500 pessoas já estão no VIP aproveitando:
• Conteúdo exclusivo diário
• Comunidade engajada
• Suporte direto

🚀 Não deixe para depois!`,
    },
    {
      text: `⏰ Já se passou 24 horas...

Vi que você ainda não entrou no VIP.

O que está te impedindo? Posso ajudar com alguma dúvida?

💎 Clique abaixo e garanta seu acesso!`,
    },
    {
      text: `🔔 Lembrete importante!

Faz 2 dias que você viu nossa oferta...

Não perca mais tempo! O conteúdo exclusivo está esperando por você.

✨ Assine agora por apenas R$ 29,90/mês!`,
    },
    {
      text: `🚨 ÚLTIMA OPORTUNIDADE!

Já faz 3 dias... Essa é sua última chance!

Centenas de pessoas já estão aproveitando o VIP.

Não fique de fora! 🎯`,
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

function getMinutesSince(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return diffMs / (1000 * 60);
}

function getHoursSince(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return diffMs / (1000 * 60 * 60);
}
