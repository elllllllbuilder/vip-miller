export interface CreateChargeRequest {
  amount: number; // valor em reais (ex: 29.90)
  description: string;
  webhook_url?: string;
  client: {
    name: string;
    cpf: string;
    email: string;
    phone: string;
  };
  metadata?: Record<string, any>;
}

export interface CreateChargeResponse {
  identifier: string; // ID da transação na SyncPay
  pix_code: string; // código Pix para copiar e colar
  qr_code?: string; // QR code em base64 (opcional)
  status?: string;
  amount?: number;
  description?: string;
  created_at?: string;
}

export interface GetChargeResponse {
  identifier: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  amount: number;
  description: string;
  paid_at?: string;
  created_at: string;
  metadata?: Record<string, any>;
}
