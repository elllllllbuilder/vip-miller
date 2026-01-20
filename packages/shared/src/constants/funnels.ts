export const FUNNEL_TYPES = {
  VIP: 'vip',
  SALES_FIRST: 'sales_first',
  SALES_RETURNING: 'sales_returning',
} as const;

export type FunnelType = typeof FUNNEL_TYPES[keyof typeof FUNNEL_TYPES];
