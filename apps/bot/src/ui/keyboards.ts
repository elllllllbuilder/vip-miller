import { InlineKeyboard } from 'grammy';

export function getSubscribeKeyboard() {
  return new InlineKeyboard()
    .text('💳 Assinar VIP - R$ 29,90/mês', 'subscribe:monthly_vip');
}

export function getPaymentKeyboard(mockMode: boolean = false) {
  const keyboard = new InlineKeyboard()
    .text('✅ Já paguei', 'payment:check');
  
  if (mockMode) {
    keyboard.row().text('🧪 Confirmar Pagamento (MOCK)', 'payment:mock_confirm');
  }
  
  return keyboard;
}
