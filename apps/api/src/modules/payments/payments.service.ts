import { PaymentsRepository } from './payments.repo';
import { SyncPayClient } from '@vip-system/sdk-syncpay/src/syncpay.client';
import { env } from '../../config/env';
import { PLANS } from '@vip-system/shared/src/constants/plans';
import { NotFoundError } from '../../shared/http/errors';

export class PaymentsService {
  private syncPayClient: SyncPayClient;
  private mockMode: boolean;

  constructor(private paymentsRepo: PaymentsRepository) {
    this.syncPayClient = new SyncPayClient(
      env.SYNCPAY_CLIENT_ID, 
      env.SYNCPAY_CLIENT_SECRET, 
      env.SYNCPAY_API_URL
    );
    this.mockMode = process.env.SYNCPAY_MOCK_MODE === 'true';
  }

  async createPixPayment(userId: string, planId: string) {
    const plan = PLANS.MONTHLY_VIP;
    
    let charge;
    
    if (this.mockMode) {
      // Modo mock para testes
      console.log('🧪 MOCK MODE: Gerando pagamento fake');
      charge = {
        id: `mock_charge_${Date.now()}`,
        status: 'pending' as const,
        amount: plan.price,
        description: `Assinatura ${plan.name}`,
        payment_method: 'pix' as const,
        pix: {
          qr_code: 'mock_qr_code_base64',
          qr_code_url: 'https://example.com/qr.png',
          copy_paste: '00020126580014br.gov.bcb.pix0136mock-pix-code-for-testing',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        created_at: new Date().toISOString(),
        metadata: {
          user_id: userId,
          plan_id: planId,
        },
      };
    } else {
      // Criar cobrança real no SyncPay
      charge = await this.syncPayClient.createPixCharge({
        amount: plan.price,
        description: `Assinatura ${plan.name}`,
        metadata: {
          user_id: userId,
          plan_id: planId,
        },
      });
    }

    // Salvar payment no banco
    const payment = await this.paymentsRepo.create({
      user_id: userId,
      plan_id: planId,
      amount: plan.price,
      status: 'pending',
      provider: 'syncpay',
      provider_charge_id: charge.id,
      pix_copy_paste: charge.pix.copy_paste,
      pix_qr_code: charge.pix.qr_code_url,
    });

    return {
      payment_id: payment.id,
      pix_copy_paste: charge.pix.copy_paste,
      pix_qr_code: charge.pix.qr_code_url,
      amount: plan.price,
    };
  }

  async confirmPayment(providerChargeId: string, subscriptionId: string) {
    const payment = await this.paymentsRepo.findByProviderChargeId(providerChargeId);
    
    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    return this.paymentsRepo.update(payment.id, {
      status: 'paid',
      subscription_id: subscriptionId,
      paid_at: new Date(),
    });
  }

  async getPaymentByChargeId(providerChargeId: string) {
    return this.paymentsRepo.findByProviderChargeId(providerChargeId);
  }

  async listPayments(limit?: number, offset?: number) {
    return this.paymentsRepo.findAll(limit, offset);
  }
}
