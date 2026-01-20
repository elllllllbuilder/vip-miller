import axios from 'axios';
import { env } from '../config/env';

export class TelegramClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}`;
  }

  async sendMessage(chatId: number, text: string, options?: any) {
    const response = await axios.post(`${this.baseUrl}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      ...options,
    });
    return response.data;
  }

  async banChatMember(chatId: string, userId: number) {
    await axios.post(`${this.baseUrl}/banChatMember`, {
      chat_id: chatId,
      user_id: userId,
    });
  }

  async unbanChatMember(chatId: string, userId: number) {
    await axios.post(`${this.baseUrl}/unbanChatMember`, {
      chat_id: chatId,
      user_id: userId,
    });
  }
}
