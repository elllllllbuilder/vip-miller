import axios from 'axios';
import { env } from '../config/env';

export class TelegramClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}`;
  }

  async getChatMember(chatId: string, userId: number) {
    const response = await axios.get(`${this.baseUrl}/getChatMember`, {
      params: {
        chat_id: chatId,
        user_id: userId,
      },
    });
    return response.data;
  }

  async isUserInChat(chatId: string, userId: number): Promise<boolean> {
    try {
      const response = await this.getChatMember(chatId, userId);
      const status = response.result?.status;
      return ['member', 'administrator', 'creator'].includes(status);
    } catch (error) {
      return false;
    }
  }
}
