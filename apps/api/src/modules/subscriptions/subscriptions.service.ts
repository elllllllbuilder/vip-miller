import { SubscriptionsRepository } from './subscriptions.repo';
import { addDays } from '../../shared/utils/time';
import { PLANS } from '@vip-system/shared/src/constants/plans';

export class SubscriptionsService {
  constructor(private subscriptionsRepo: SubscriptionsRepository) {}

  async getActiveSubscription(userId: string) {
    return this.subscriptionsRepo.findActiveByUserId(userId);
  }

  async createOrRenewSubscription(userId: string, planId: string) {
    const existingSubscription = await this.subscriptionsRepo.findActiveByUserId(userId);
    
    const plan = PLANS.MONTHLY_VIP;
    const now = new Date();
    
    if (existingSubscription) {
      // Renovar: adicionar dias à data de expiração atual
      const newExpiresAt = addDays(existingSubscription.expires_at, plan.durationDays);
      return this.subscriptionsRepo.update(existingSubscription.id, {
        expires_at: newExpiresAt,
        status: 'active',
      });
    } else {
      // Criar nova
      const expiresAt = addDays(now, plan.durationDays);
      return this.subscriptionsRepo.create({
        user_id: userId,
        plan_id: planId,
        started_at: now,
        expires_at: expiresAt,
        status: 'active',
      });
    }
  }

  async expireSubscription(subscriptionId: string) {
    return this.subscriptionsRepo.update(subscriptionId, {
      status: 'expired',
    });
  }

  async findExpiringSubscriptions(daysAhead: number) {
    const now = new Date();
    const targetDate = addDays(now, daysAhead);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    return this.subscriptionsRepo.findExpiringBetween(targetDate, endOfDay);
  }

  async listSubscriptions(limit?: number, offset?: number) {
    return this.subscriptionsRepo.findAll(limit, offset);
  }
}
