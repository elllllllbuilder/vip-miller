import { SyncPayHttp } from './syncpay.http';
import { CreateChargeRequest, CreateChargeResponse, GetChargeResponse } from './types';

export class SyncPayClient {
  private http: SyncPayHttp;

  constructor(clientId: string, clientSecret: string, baseUrl?: string) {
    this.http = new SyncPayHttp(clientId, clientSecret, baseUrl);
  }

  async createPixCharge(request: CreateChargeRequest): Promise<CreateChargeResponse> {
    // Endpoint correto baseado na documentação da SyncPay
    return this.http.post<CreateChargeResponse>('/api/partner/v1/cash-in', request);
  }

  async getCharge(chargeId: string): Promise<GetChargeResponse> {
    return this.http.get<GetChargeResponse>(`/api/partner/v1/transactions/${chargeId}`);
  }
}
