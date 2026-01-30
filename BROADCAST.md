# 📢 Sistema de Broadcast (Envio em Massa)

Sistema para enviar mensagens para todos os usuários que já interagiram com o bot.

## 🎯 Públicos Disponíveis

| Público | Descrição |
|---------|-----------|
| **all** | Todos os usuários que já deram /start |
| **vip** | Apenas usuários com assinatura ativa |
| **non-vip** | Apenas usuários sem assinatura ativa |
| **expired** | Apenas usuários que já foram VIP mas expiraram |

## 🚀 Como Usar

### Opção 1: Via API (Recomendado)

#### 1. Ver quantos usuários tem em cada público

**Todos:**
```bash
curl https://vip-system-api.onrender.com/broadcast/users/all
```

**VIPs:**
```bash
curl https://vip-system-api.onrender.com/broadcast/users/vip
```

**Não-VIPs:**
```bash
curl https://vip-system-api.onrender.com/broadcast/users/non-vip
```

**Expirados:**
```bash
curl https://vip-system-api.onrender.com/broadcast/users/expired
```

#### 2. Enviar broadcast

**Mensagem simples:**
```bash
curl -X POST https://vip-system-api.onrender.com/broadcast/send \
  -H "Content-Type: application/json" \
  -d '{
    "message": "🎉 Novidade! Temos conteúdo novo no grupo VIP!",
    "target": "all"
  }'
```

**Mensagem com botão:**
```bash
curl -X POST https://vip-system-api.onrender.com/broadcast/send \
  -H "Content-Type: application/json" \
  -d '{
    "message": "🔥 PROMOÇÃO! Assine agora com desconto!",
    "target": "non-vip",
    "button": {
      "text": "💎 Assinar Agora",
      "callback_data": "subscribe_monthly"
    }
  }'
```

### Opção 2: Via Postman/Insomnia

1. Crie uma requisição POST
2. URL: `https://vip-system-api.onrender.com/broadcast/send`
3. Body (JSON):
```json
{
  "message": "Sua mensagem aqui",
  "target": "all",
  "button": {
    "text": "Texto do botão",
    "callback_data": "subscribe_monthly"
  }
}
```

### Opção 3: Via Script (Linux/Mac)

```bash
chmod +x broadcast.sh
./broadcast.sh
```

## 📋 Exemplos de Uso

### 1. Avisar todos sobre novidade
```json
{
  "message": "🎉 Novidade no VIP!\n\nAcabamos de adicionar conteúdo exclusivo sobre [TEMA].\n\nNão perca!",
  "target": "vip"
}
```

### 2. Promoção para não-VIPs
```json
{
  "message": "🔥 PROMOÇÃO RELÂMPAGO!\n\nAssine agora e ganhe 7 dias grátis!\n\nApenas hoje! ⏰",
  "target": "non-vip",
  "button": {
    "text": "💎 Quero Assinar",
    "callback_data": "subscribe_monthly"
  }
}
```

### 3. Reconquistar expirados
```json
{
  "message": "😢 Sentimos sua falta!\n\nVocê já foi VIP e sabemos que curtiu o conteúdo.\n\nQue tal voltar? Temos muitas novidades!",
  "target": "expired",
  "button": {
    "text": "🔄 Voltar ao VIP",
    "callback_data": "subscribe_monthly"
  }
}
```

### 4. Lembrete de renovação
```json
{
  "message": "⏰ Lembrete!\n\nSua assinatura está próxima do vencimento.\n\nRenove agora para não perder o acesso!",
  "target": "vip",
  "button": {
    "text": "🔄 Renovar Agora",
    "callback_data": "subscribe_monthly"
  }
}
```

## 🔧 Integração com Worker

Para enviar broadcasts de forma assíncrona (recomendado para muitos usuários):

1. Edite `apps/worker/src/main.ts`
2. Adicione o handler:

```typescript
import { processBroadcast } from './jobs/broadcast.job';

// No worker
if (job.name === 'send-broadcast') {
  return processBroadcast(job);
}
```

3. Adicione a fila:

```typescript
await renewalQueue.add(
  'send-broadcast',
  {
    message: 'Sua mensagem',
    users: ['123456789', '987654321'],
    button: { text: 'Botão', callback_data: 'action' }
  }
);
```

## ⚠️ Boas Práticas

### 1. Não envie spam
- Máximo 1-2 broadcasts por semana
- Conteúdo relevante e valioso
- Respeite o usuário

### 2. Segmente seu público
- VIPs: Conteúdo exclusivo, novidades
- Não-VIPs: Ofertas, promoções
- Expirados: Reconquista, novidades

### 3. Teste antes
- Envie para você mesmo primeiro
- Verifique formatação
- Teste os botões

### 4. Horários ideais
- 10h-12h: Manhã
- 14h-16h: Tarde
- 19h-21h: Noite
- Evite madrugada e finais de semana

### 5. Rate Limit
O sistema já tem delay de 100ms entre mensagens para evitar bloqueio do Telegram.

## 📊 Monitoramento

### Ver logs do broadcast
```bash
# No Render → Worker → Logs
📢 Processing broadcast...
📤 Sent 10/100 messages
📤 Sent 20/100 messages
...
✅ Broadcast completed: 95 sent, 5 failed
```

### Estatísticas
A API retorna:
```json
{
  "success": true,
  "total_users": 100,
  "users": ["123...", "456..."]
}
```

## 🚫 Limitações do Telegram

- Máximo ~30 mensagens/segundo
- Usuários que bloquearam o bot não recebem
- Usuários que deletaram a conta não recebem

## 🔐 Segurança (Opcional)

Para adicionar autenticação:

```typescript
// Em broadcast.controller.ts
app.post('/broadcast/send', {
  preHandler: async (request, reply) => {
    const token = request.headers.authorization;
    if (token !== 'SEU_TOKEN_SECRETO') {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
  }
}, async (request, reply) => {
  // ... código do broadcast
});
```

Depois use:
```bash
curl -X POST https://vip-system-api.onrender.com/broadcast/send \
  -H "Authorization: SEU_TOKEN_SECRETO" \
  -H "Content-Type: application/json" \
  -d '...'
```

## 📝 Próximos Passos

1. Registrar rotas na API
2. Deploy da API
3. Testar com você mesmo
4. Enviar para todos!

## ✅ Checklist

- [ ] Rotas registradas na API
- [ ] API deployed
- [ ] Testado enviando para você mesmo
- [ ] Mensagem revisada
- [ ] Horário adequado
- [ ] Público correto selecionado
- [ ] Broadcast enviado!
