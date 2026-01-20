import { ApiClient } from '../clients/api.client';
import { TelegramClient } from '../clients/telegram.client';
import { getRenewalMessage } from '../templates/renewal.pt-br';

export class RenewalService {
  constructor(
    private apiClient: ApiClient,
    private telegramClient: TelegramClient
  ) {}

  async sendRenewalReminders(daysAhead: number) {
    console.log(`Checking subscriptions expiring in ${daysAhead} days...`);
    
    // Em produção, isso viria da API
    // const subscriptions = await this.apiClient.getExpiringSubscriptions(daysAhead);
    
    // Simulação - em produção, iterar sobre subscriptions reais
    const subscriptions: any[] = [];

    for (const subscription of subscriptions) {
      try {
        const message = getRenewalMessage(daysAhead, subscription.user.first_name);
        const telegramUserId = parseInt(subscription.user.telegram_user_id);

        await this.telegramClient.sendMessage(telegramUserId, message);
        
        console.log(`Renewal reminder sent to user ${telegramUserId}`);
      } catch (error) {
        console.error(`Failed to send reminder to user ${subscription.user.telegram_user_id}:`, error);
      }
    }

    console.log(`Processed ${subscriptions.length} renewal reminders`);
  }

  async processExpiredSubscriptions() {
    console.log('Processing expired subscriptions...');
    
    // Em produção, buscar subscriptions expiradas da API
    const expiredSubscriptions: any[] = [];

    for (const subscription of expiredSubscriptions) {
      try {
        const telegramUserId = parseInt(subscription.user.telegram_user_id);
        
        // Enviar mensagem de expiração
        const message = getRenewalMessage(0, subscription.user.first_name);
        await this.telegramClient.sendMessage(telegramUserId, message);

        // Remover do grupo VIP (opcional - configurável)
        // await this.telegramClient.banChatMember(VIP_CHAT_ID, telegramUserId);
        // await this.telegramClient.unbanChatMember(VIP_CHAT_ID, telegramUserId);

        // Marcar como expirado na API
        // await this.apiClient.expireSubscription(subscription.id);

        console.log(`Processed expired subscription for user ${telegramUserId}`);
      } catch (error) {
        console.error(`Failed to process expired subscription ${subscription.id}:`, error);
      }
    }

    console.log(`Processed ${expiredSubscriptions.length} expired subscriptions`);
  }
}
