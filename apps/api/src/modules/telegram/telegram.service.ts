import { TelegramHttp } from '@vip-system/sdk-telegram/src/telegram.http';
import { TelegramMethods } from '@vip-system/sdk-telegram/src/telegram.methods';
import { env } from '../../config/env';

export class TelegramService {
  private methods: TelegramMethods;

  constructor() {
    const http = new TelegramHttp(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_API_URL);
    this.methods = new TelegramMethods(http);
  }

  async isUserInVipGroup(userId: number): Promise<boolean> {
    try {
      const response = await this.methods.getChatMember(env.TELEGRAM_VIP_CHAT_ID, userId);
      const status = response.result.status;
      return ['member', 'administrator', 'creator'].includes(status);
    } catch (error) {
      return false;
    }
  }

  async createInviteLink(userId: number, subscriptionId: string) {
    try {
      console.log(`🔍 DEBUG: Criando link de convite para userId: ${userId}, subscriptionId: ${subscriptionId}`);
      console.log(`🔍 DEBUG: Grupo VIP ID: ${env.TELEGRAM_VIP_CHAT_ID}`);
      
      const expireDate = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 horas
      
      const response = await this.methods.createChatInviteLink(env.TELEGRAM_VIP_CHAT_ID, {
        name: `Convite VIP - User ${userId}`,
        expire_date: expireDate,
        member_limit: 1,
      });

      console.log(`✅ DEBUG: Link de convite criado:`, response.result.invite_link);
      return response.result.invite_link;
    } catch (error: any) {
      console.error(`❌ DEBUG: Erro ao criar link de convite:`, error);
      console.error(`❌ DEBUG: Error details:`, {
        message: error.message,
        code: error.code,
        response: error.response?.data
      });
      throw error;
    }
  }

  async sendMessage(chatId: number, text: string, options?: any) {
    try {
      console.log(`🔍 DEBUG: Tentando enviar mensagem para chatId: ${chatId}`);
      console.log(`🔍 DEBUG: Texto da mensagem: ${text.substring(0, 100)}...`);
      
      const result = await this.methods.sendMessage(chatId, text, options);
      
      console.log(`✅ DEBUG: Mensagem enviada com sucesso:`, result);
      return result;
    } catch (error: any) {
      console.error(`❌ DEBUG: Erro ao enviar mensagem para ${chatId}:`, error);
      console.error(`❌ DEBUG: Error details:`, {
        message: error.message,
        code: error.code,
        response: error.response?.data
      });
      throw error;
    }
  }

  async removeUserFromGroup(userId: number) {
    await this.methods.banChatMember(env.TELEGRAM_VIP_CHAT_ID, userId);
    await this.methods.unbanChatMember(env.TELEGRAM_VIP_CHAT_ID, userId);
  }
}
