import { StateRepository } from '../state/state.repo';
import { FUNNEL_TYPES } from '@vip-system/shared/src/constants/funnels';

export class FunnelsService {
  constructor(private stateRepo: StateRepository) {}

  async updateFunnelState(userId: string, funnel: string, step: number) {
    return this.stateRepo.updateStep(userId, funnel, step);
  }

  async markStartSeen(userId: string) {
    return this.stateRepo.markStartSeen(userId);
  }

  async getUserState(userId: string) {
    return this.stateRepo.findByUserId(userId);
  }

  async initializeUserState(userId: string, isVip: boolean, hasSeenStart: boolean) {
    let funnel: string;
    
    if (isVip) {
      funnel = FUNNEL_TYPES.VIP;
    } else if (!hasSeenStart) {
      funnel = FUNNEL_TYPES.SALES_FIRST;
    } else {
      funnel = FUNNEL_TYPES.SALES_RETURNING;
    }

    return this.stateRepo.upsert(userId, {
      start_seen: true,
      current_funnel: funnel,
      current_step: 1,
    });
  }
}
