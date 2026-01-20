export interface CreateChargeRequest {
  amount: number;
  description: string;
  customer?: {
    name?: string;
    email?: string;
    document?: string;
  };
  metadata?: Record<string, any>;
}

export interface CreateChargeResponse {
  id: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  amount: number;
  description: string;
  payment_method: 'pix';
  pix: {
    qr_code: string;
    qr_code_url?: string;
    copy_paste: string;
    expires_at: string;
  };
  created_at: string;
  metadata?: Record<string, any>;
}

export interface GetChargeResponse {
  id: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  amount: number;
  description: string;
  payment_method: string;
  paid_at?: string;
  created_at: string;
  metadata?: Record<string, any>;
}
