import axios, { AxiosInstance } from 'axios';

export class SyncPayHttp {
  private client: AxiosInstance;
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(clientId: string, clientSecret: string, baseUrl: string = 'https://syncpayments.com.br') {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private async getAccessToken(): Promise<string> {
    // Se já temos um token válido, usar ele
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Gerar novo token
    const response = await this.client.post('/api/partner/v1/auth-token', {
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    this.accessToken = response.data.access_token;
    this.tokenExpiry = new Date(response.data.expires_at);
    
    return this.accessToken;
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const token = await this.getAccessToken();
    
    const response = await this.client.post(endpoint, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return response.data;
  }

  async get<T>(endpoint: string, params?: any): Promise<T> {
    const token = await this.getAccessToken();
    
    const response = await this.client.get(endpoint, { 
      params,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return response.data;
  }
}
