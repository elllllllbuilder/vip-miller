export interface User {
  id: string;
  telegram_user_id: string;
  username: string | null;
  first_name: string;
  last_name: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'expired' | 'cancelled';
  plan_id: string;
  started_at: Date;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id: string | null;
  plan_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  provider: 'syncpay';
  provider_charge_id: string;
  pix_copy_paste: string | null;
  pix_qr_code: string | null;
  paid_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserState {
  id: string;
  user_id: string;
  start_seen: boolean;
  current_funnel: string | null;
  current_step: number;
  last_interaction_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface InviteLink {
  id: string;
  user_id: string;
  subscription_id: string;
  invite_link: string;
  used: boolean;
  expires_at: Date;
  created_at: Date;
}

export interface MessageLog {
  id: string;
  user_id: string;
  message_type: string;
  funnel: string | null;
  step: number | null;
  sent_at: Date;
}
