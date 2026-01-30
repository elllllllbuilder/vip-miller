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

  async get<T>(path: string): Promise<T> {
    const response = await this.client.get(path);
    return response.data;
  }

  async post<T>(path: string, data?: any): Promise<T> {
    const response = await this.client.post(path, data);
    return response.data;
  }
}
