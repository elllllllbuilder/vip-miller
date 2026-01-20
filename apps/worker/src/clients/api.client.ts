import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env';

export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.API_URL,
      timeout: 30000,
    });
  }

  async getExpiringSubscriptions(daysAhead: number) {
    const response = await this.client.get('/subscriptions/expiring', {
      params: { days_ahead: daysAhead },
    });
    return response.data;
  }

  async expireSubscription(subscriptionId: string) {
    const response = await this.client.post(`/subscriptions/${subscriptionId}/expire`);
    return response.data;
  }
}
