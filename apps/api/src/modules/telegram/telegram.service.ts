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
    const expireDate = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 horas
    
    const response = await this.methods.createChatInviteLink(env.TELEGRAM_VIP_CHAT_ID, {
      name: `Convite VIP - User ${userId}`,
      expire_date: expireDate,
      member_limit: 1,
    });

    return response.result.invite_link;
  }

  async sendMessage(chatId: number, text: string, options?: any) {
    return this.methods.sendMessage(chatId, text, options);
  }

  async removeUserFromGroup(userId: number) {
    await this.methods.banChatMember(env.TELEGRAM_VIP_CHAT_ID, userId);
    await this.methods.unbanChatMember(env.TELEGRAM_VIP_CHAT_ID, userId);
  }
}
