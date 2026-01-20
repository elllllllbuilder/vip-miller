import { InlineKeyboard } from 'grammy';

export function getSubscribeKeyboard() {
  return new InlineKeyboard()
    .text('💳 Assinar VIP - R$ 29,90/mês', 'subscribe:monthly_vip');
}

export function getPaymentKeyboard() {
  return new InlineKeyboard()
    .text('✅ Já paguei', 'payment:check');
}
