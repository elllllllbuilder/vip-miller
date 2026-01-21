import { PaymentsRepository } from './payments.repo';
import { SyncPayClient } from '@vip-system/sdk-syncpay/src/syncpay.client';
import { env } from '../../config/env';
import { PLANS } from '@vip-system/shared/src/constants/plans';
import { NotFoundError } from '../../shared/http/errors';

export class PaymentsService {
  private syncPayClient: SyncPayClient;

  constructor(private paymentsRepo: PaymentsRepository) {
    this.syncPayClient = new SyncPayClient(
      env.SYNCPAY_CLIENT_ID, 
      env.SYNCPAY_CLIENT_SECRET, 
      env.SYNCPAY_API_URL
    );
  }

  async createPixPayment(userId: string, planId: string) {
    const plan = PLANS.MONTHLY_VIP;
    
    // Converter centavos para reais (2990 -> 29.90)
    const amountInReais = plan.price / 100;
    
    // Criar cobrança real no SyncPay
    const charge = await this.syncPayClient.createPixCharge({
      amount: amountInReais,
      description: `Assinatura ${plan.name}`,
      webhook_url: `https://vip-system-api.onrender.com/webhooks/syncpay`,
      client: {
        name: 'João Silva', // Nome válido
        cpf: '11144477735', // CPF válido para testes
        email: 'joao@exemplo.com', // Email válido
        phone: '11999887766', // Telefone válido
      },
      metadata: {
        user_id: userId,
        plan_id: planId,
      },
    });

    // Salvar payment no banco usando o identifier da SyncPay
    const payment = await this.paymentsRepo.create({
      user_id: userId,
      plan_id: planId,
      amount: plan.price, // manter em centavos no banco
      status: 'pending',
      provider: 'syncpay',
      provider_charge_id: charge.identifier, // usar identifier da SyncPay
      pix_copy_paste: charge.pix_code,
      pix_qr_code: charge.qr_code || null,
    });

    return {
      payment_id: payment.id,
      pix_copy_paste: charge.pix_code,
      pix_qr_code: charge.qr_code,
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

  async checkPaymentStatus(providerChargeId: string) {
    // Consultar status na SyncPay usando o identifier
    const chargeStatus = await this.syncPayClient.getCharge(providerChargeId);
    
    // Atualizar status local se necessário
    const payment = await this.paymentsRepo.findByProviderChargeId(providerChargeId);
    if (payment && payment.status !== chargeStatus.status) {
      await this.paymentsRepo.update(payment.id, {
        status: chargeStatus.status as any,
        paid_at: chargeStatus.paid_at ? new Date(chargeStatus.paid_at) : null,
      });
    }
    
    return chargeStatus;
  }

  async listPayments(limit?: number, offset?: number) {
    return this.paymentsRepo.findAll(limit, offset);
  }
}
