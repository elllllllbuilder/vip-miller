import { TelegramHttp } from './telegram.http';
import { ChatMemberResponse, InviteLinkResponse, SendMessageResponse } from './types';

export class TelegramMethods {
  constructor(private http: TelegramHttp) {}

  async getChatMember(chatId: string | number, userId: number): Promise<ChatMemberResponse> {
    return this.http.get<ChatMemberResponse>('getChatMember', {
      chat_id: chatId,
      user_id: userId,
    });
  }

  async createChatInviteLink(
    chatId: string | number,
    options: {
      name?: string;
      expire_date?: number;
      member_limit?: number;
      creates_join_request?: boolean;
    }
  ): Promise<InviteLinkResponse> {
    return this.http.post<InviteLinkResponse>('createChatInviteLink', {
      chat_id: chatId,
      ...options,
    });
  }

  async sendMessage(
    chatId: string | number,
    text: string,
    options?: {
      parse_mode?: 'HTML' | 'Markdown';
      reply_markup?: any;
    }
  ): Promise<SendMessageResponse> {
    return this.http.post<SendMessageResponse>('sendMessage', {
      chat_id: chatId,
      text,
      ...options,
    });
  }

  async banChatMember(chatId: string | number, userId: number): Promise<{ ok: boolean }> {
    return this.http.post('banChatMember', {
      chat_id: chatId,
      user_id: userId,
    });
  }

  async unbanChatMember(chatId: string | number, userId: number): Promise<{ ok: boolean }> {
    return this.http.post('unbanChatMember', {
      chat_id: chatId,
      user_id: userId,
    });
  }
}
