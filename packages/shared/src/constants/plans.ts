export const PLANS = {
  MONTHLY_VIP: {
    id: 'monthly_vip',
    name: 'VIP Mensal',
    price: 2990, // centavos
    durationDays: 30,
  },
} as const;

export type PlanId = keyof typeof PLANS;
