import { SyncPayHttp } from './syncpay.http';
import { CreateChargeRequest, CreateChargeResponse, GetChargeResponse } from './types';

export class SyncPayClient {
  private http: SyncPayHttp;

  constructor(apiKey: string, baseUrl?: string) {
    this.http = new SyncPayHttp(apiKey, baseUrl);
  }

  async createPixCharge(request: CreateChargeRequest): Promise<CreateChargeResponse> {
    return this.http.post<CreateChargeResponse>('/v1/charges', {
      ...request,
      payment_method: 'pix',
    });
  }

  async getCharge(chargeId: string): Promise<GetChargeResponse> {
    return this.http.get<GetChargeResponse>(`/v1/charges/${chargeId}`);
  }
}
