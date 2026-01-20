export function getRenewalMessage(daysLeft: number, userName: string): string {
  if (daysLeft === 7) {
    return `👋 Olá ${userName}!

⏰ Sua assinatura VIP expira em 7 dias.

Para continuar aproveitando todo o conteúdo exclusivo, não esqueça de renovar!

Use /start para renovar sua assinatura.`;
  }

  if (daysLeft === 3) {
    return `⚠️ Atenção ${userName}!

Sua assinatura VIP expira em apenas 3 dias!

Não perca o acesso ao grupo e todo conteúdo exclusivo. Renove agora!

Use /start para renovar.`;
  }

  if (daysLeft === 1) {
    return `🚨 URGENTE ${userName}!

Sua assinatura VIP expira AMANHÃ!

Renove agora para não perder o acesso ao grupo VIP.

Use /start para renovar imediatamente.`;
  }

  if (daysLeft === 0) {
    return `😔 ${userName}, sua assinatura VIP expirou.

Você foi removido do grupo VIP, mas pode voltar a qualquer momento!

Use /start para fazer uma nova assinatura e recuperar seu acesso.`;
  }

  return `Sua assinatura expira em ${daysLeft} dias. Use /start para renovar.`;
}
