export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface ChatMemberResponse {
  ok: boolean;
  result: {
    status: 'creator' | 'administrator' | 'member' | 'restricted' | 'left' | 'kicked';
    user: TelegramUser;
  };
}

export interface InviteLinkResponse {
  ok: boolean;
  result: {
    invite_link: string;
    creator: TelegramUser;
    creates_join_request: boolean;
    is_primary: boolean;
    is_revoked: boolean;
    member_limit?: number;
    expire_date?: number;
    name?: string;
  };
}

export interface SendMessageResponse {
  ok: boolean;
  result: {
    message_id: number;
    from: TelegramUser;
    chat: {
      id: number;
      type: string;
    };
    date: number;
    text: string;
  };
}
