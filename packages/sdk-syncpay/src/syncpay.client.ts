import { SyncPayHttp } from './syncpay.http';
import { CreateChargeRequest, CreateChargeResponse, GetChargeResponse } from './types';

export class SyncPayClient {
  private http: SyncPayHttp;

  constructor(clientId: string, clientSecret: string, baseUrl?: string) {
    this.http = new SyncPayHttp(clientId, clientSecret, baseUrl);
  }

  async createPixCharge(request: CreateChargeRequest): Promise<CreateChargeResponse> {
    // Endpoint baseado na documentação da SyncPay
    return this.http.post<CreateChargeResponse>('/api/partner/v1/charges', {
      ...request,
      payment_method: 'pix',
    });
  }

  async getCharge(chargeId: string): Promise<GetChargeResponse> {
    return this.http.get<GetChargeResponse>(`/api/partner/v1/charges/${chargeId}`);
  }
}
