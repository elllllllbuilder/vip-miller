import axios, { AxiosInstance } from 'axios';

export class TelegramHttp {
  private client: AxiosInstance;

  constructor(botToken: string, baseUrl: string = 'https://api.telegram.org') {
    this.client = axios.create({
      baseURL: `${baseUrl}/bot${botToken}`,
      timeout: 30000,
    });
  }

  async post<T>(method: string, data?: any): Promise<T> {
    const response = await this.client.post(`/${method}`, data);
    return response.data;
  }

  async get<T>(method: string, params?: any): Promise<T> {
    const response = await this.client.get(`/${method}`, { params });
    return response.data;
  }
}
