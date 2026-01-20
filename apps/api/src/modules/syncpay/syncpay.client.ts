import { SyncPayClient as BaseSyncPayClient } from '@vip-system/sdk-syncpay/src/syncpay.client';
import { env } from '../../config/env';

export class SyncPayClientWrapper {
  private client: BaseSyncPayClient;

  constructor() {
    this.client = new BaseSyncPayClient(env.SYNCPAY_API_KEY, env.SYNCPAY_API_URL);
  }

  async createPixCharge(amount: number, description: string, metadata?: any) {
    return this.client.createPixCharge({
      amount,
      description,
      metadata,
    });
  }

  async getCharge(chargeId: string) {
    return this.client.getCharge(chargeId);
  }
}
