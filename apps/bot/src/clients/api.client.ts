import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env';

export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async ensureUserExists(userData: {
    telegram_user_id: string;
    username?: string;
    first_name: string;
    last_name?: string;
  }) {
    try {
      const response = await this.client.post('/users', userData);
      return response.data;
    } catch (error) {
      // Ignorar erro se usuário já existe
      console.log('User already exists or error creating user');
    }
  }

  async createPixPayment(telegramUserId: string, planId: string) {
    const response = await this.client.post('/payments/pix', {
      telegram_user_id: telegramUserId,
      plan_id: planId,
    });
    return response.data;
  }

  async getSubscription(telegramUserId: string) {
    const response = await this.client.get(`/subscriptions/${telegramUserId}`);
    return response.data;
  }

  async markOfferShown(telegramUserId: string) {
    try {
      await this.client.post('/followup/mark-offer-shown', {
        telegram_user_id: telegramUserId,
      });
    } catch (error) {
      console.error('Error marking offer shown:', error);
    }
  }
}
