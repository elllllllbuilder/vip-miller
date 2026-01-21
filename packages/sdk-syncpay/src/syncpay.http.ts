import axios, { AxiosError, AxiosInstance } from 'axios';

type SyncPayTokenResponse = {
  access_token: string;
  token_type?: string;
  expires_in?: number; // segundos (ex: 3600)
  expires_at?: string; // pode ou não existir
};

export class SyncPayHttp {
  private client: AxiosInstance;
  private clientId: string;
  private clientSecret: string;

  private accessToken: string | null = null;
  private tokenExpiryMs: number | null = null;
  private tokenPromise: Promise<string> | null = null;

  constructor(
    clientId: string,
    clientSecret: string,
    baseUrl: string = 'https://api.syncpayments.com.br'
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;

    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private isTokenValid(): boolean {
    if (!this.accessToken || !this.tokenExpiryMs) return false;
    return Date.now() < this.tokenExpiryMs;
  }

  private clearToken() {
    this.accessToken = null;
    this.tokenExpiryMs = null;
    this.tokenPromise = null;
  }

  private async getAccessToken(): Promise<string> {
    // token válido
    if (this.isTokenValid()) return this.accessToken!;

    // evita 2 requests simultâneas de token
    if (this.tokenPromise) return this.tokenPromise;

    this.tokenPromise = (async () => {
      const response = await this.client.post<SyncPayTokenResponse>(
        // ✅ endpoint correto
        '/api/partner/v1/auth-token',
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }
      );

      const token = response.data.access_token;
      if (!token) {
        this.clearToken();
        throw new Error('SyncPay auth-token: access_token ausente na resposta');
      }

      // ✅ preferir expires_in (segundos). A doc mostra expires_in: 3600. 
      const expiresInSec =
        typeof response.data.expires_in === 'number' ? response.data.expires_in : null;

      // fallback: expires_at se existir e for parseável
      const expiresAtMs =
        response.data.expires_at ? Date.parse(response.data.expires_at) : NaN;

      // margem de segurança (renovar 60s antes)
      const safetyMs = 60_000;

      const expiryMs = expiresInSec
        ? Date.now() + expiresInSec * 1000 - safetyMs
        : Number.isFinite(expiresAtMs)
          ? expiresAtMs - safetyMs
          : Date.now() + 3600 * 1000 - safetyMs; // fallback conservador

      this.accessToken = token;
      this.tokenExpiryMs = expiryMs;
      this.tokenPromise = null;

      return token;
    })().catch((err) => {
      this.clearToken();
      throw err;
    });

    return this.tokenPromise;
  }

  private async requestWithAuth<T>(
    method: 'get' | 'post',
    endpoint: string,
    dataOrParams?: any
  ): Promise<T> {
    const token = await this.getAccessToken();

    try {
      if (method === 'post') {
        const res = await this.client.post<T>(endpoint, dataOrParams, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
      } else {
        const res = await this.client.get<T>(endpoint, {
          params: dataOrParams,
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
      }
    } catch (e) {
      const err = e as AxiosError;

      // ✅ se token expirou/revogou, tenta 1 vez com token novo
      if (err.response?.status === 401) {
        this.clearToken();
        const newToken = await this.getAccessToken();

        if (method === 'post') {
          const res = await this.client.post<T>(endpoint, dataOrParams, {
            headers: { Authorization: `Bearer ${newToken}` },
          });
          return res.data;
        } else {
          const res = await this.client.get<T>(endpoint, {
            params: dataOrParams,
            headers: { Authorization: `Bearer ${newToken}` },
          });
          return res.data;
        }
      }

      throw err;
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.requestWithAuth<T>('post', endpoint, data);
  }

  async get<T>(endpoint: string, params?: any): Promise<T> {
    return this.requestWithAuth<T>('get', endpoint, params);
  }
}
