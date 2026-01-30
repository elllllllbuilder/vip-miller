// Mensagens de follow-up para usuários que não assinaram

export const FOLLOWUP_MESSAGES = [
  {
    // Enviada após 24 horas
    hours: 24,
    text: `👋 Oi! Notei que você ainda não garantiu seu acesso ao VIP.

🤔 Ficou com alguma dúvida? Estou aqui para ajudar!

O grupo VIP está crescendo rápido e o conteúdo exclusivo está cada vez melhor.

💎 Que tal garantir seu acesso agora?`,
    keyboard: 'subscribe',
  },
  {
    // Enviada após 3 dias (72 horas)
    hours: 72,
    text: `🔥 Última chance de aproveitar!

Mais de 500 pessoas já estão no VIP aproveitando:
• Conteúdo exclusivo diário
• Comunidade engajada
• Suporte direto

Por apenas R$ 29,90/mês você não fica de fora!

⏰ Não deixe para depois, garanta agora!`,
    keyboard: 'subscribe',
  },
  {
    // Enviada após 7 dias (168 horas)
    hours: 168,
    text: `💰 OFERTA ESPECIAL!

Vi que você ainda não entrou no VIP...

Que tal uma última chance? 

Clique abaixo e garanta seu acesso ao melhor conteúdo exclusivo!

🚀 Não perca mais tempo!`,
    keyboard: 'subscribe',
  },
];

// Mensagem para quem clicou em assinar mas não pagou
export const ABANDONED_PAYMENT_MESSAGE = {
  // Enviada após 2 horas do Pix gerado
  hours: 2,
  text: `💳 Opa! Vi que você gerou um Pix mas ainda não pagou...

O código Pix expira em breve! ⏰

Quer que eu gere um novo código para você?

Clique no botão abaixo:`,
  keyboard: 'subscribe',
};
