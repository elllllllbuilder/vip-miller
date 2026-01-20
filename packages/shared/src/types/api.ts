import { z } from 'zod';

export const CreatePixPaymentSchema = z.object({
  telegram_user_id: z.string(),
  plan_id: z.string(),
});

export type CreatePixPaymentRequest = z.infer<typeof CreatePixPaymentSchema>;

export interface CreatePixPaymentResponse {
  payment_id: string;
  pix_copy_paste: string;
  pix_qr_code?: string;
  amount: number;
}

export const SyncPayWebhookSchema = z.object({
  event: z.string(),
  charge_id: z.string(),
  status: z.string(),
  amount: z.number().optional(),
  paid_at: z.string().optional(),
});

export type SyncPayWebhookPayload = z.infer<typeof SyncPayWebhookSchema>;
