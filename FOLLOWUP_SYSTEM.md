# 🔄 Sistema de Follow-up Automático

Sistema que envia mensagens automáticas para usuários que viram a oferta mas não assinaram.

## 📋 Como Funciona

### 1. Usuário vê a oferta mas não assina
Quando o usuário envia `/start` e não é VIP, o sistema:
- ✅ Registra que ele viu a oferta (`last_offer_shown_at`)
- ✅ Inicia o contador de follow-ups

### 2. Follow-ups automáticos

O Worker verifica **a cada 6 horas** e envia mensagens nos seguintes intervalos:

| Tempo | Mensagem |
|-------|----------|
| **24 horas** | Lembrete amigável |
| **3 dias (72h)** | Urgência social (500 pessoas já entraram) |
| **7 dias (168h)** | Última chance / Oferta especial |

### 3. Pagamento abandonado

Se o usuário clicou em "Assinar" mas não pagou o Pix:
- ⏰ Após **2 horas**: Envia lembrete que o Pix expira
- 💳 Oferece gerar um novo código

### 4. Sistema para automaticamente quando:
- ✅ Usuário assina e paga
- ✅ Já enviou 3 follow-ups
- ✅ Usuário entra no grupo VIP

## 🎯 Mensagens de Follow-up

### Mensagem 1 (24 horas)
```
👋 Oi! Notei que você ainda não garantiu seu acesso ao VIP.

🤔 Ficou com alguma dúvida? Estou aqui para ajudar!

O grupo VIP está crescendo rápido e o conteúdo exclusivo está cada vez melhor.

💎 Que tal garantir seu acesso agora?
```

### Mensagem 2 (3 dias)
```
🔥 Última chance de aproveitar!

Mais de 500 pessoas já estão no VIP aproveitando:
• Conteúdo exclusivo diário
• Comunidade engajada
• Suporte direto

Por apenas R$ 29,90/mês você não fica de fora!

⏰ Não deixe para depois, garanta agora!
```

### Mensagem 3 (7 dias)
```
💰 OFERTA ESPECIAL!

Vi que você ainda não entrou no VIP...

Que tal uma última chance? 

Clique abaixo e garanta seu acesso ao melhor conteúdo exclusivo!

🚀 Não perca mais tempo!
```

### Pagamento Abandonado (2 horas)
```
💳 Opa! Vi que você gerou um Pix mas ainda não pagou...

O código Pix expira em breve! ⏰

Quer que eu gere um novo código para você?

Clique no botão abaixo:
```

## 📝 Onde Editar as Mensagens

**Mensagens de follow-up:**
```
apps/worker/src/jobs/followup.job.ts
```

**Intervalos de tempo:**
```typescript
// Em apps/worker/src/jobs/followup.job.ts
const FOLLOWUP_SCHEDULE = [
  { hours: 24, message: 1 },   // Altere para mudar o tempo
  { hours: 72, message: 2 },
  { hours: 168, message: 3 },
];
```

## 🚀 Ativação

### 1. Rodar a migration
```bash
pnpm --filter api migrate:dev
```

### 2. Registrar o job no Worker

Edite `apps/worker/src/main.ts`:

```typescript
import { processFollowUps } from './jobs/followup.job';

// Adicionar job de follow-up (roda a cada 6 horas)
await queues.followUpQueue.add(
  'process-followups',
  {},
  {
    repeat: {
      pattern: '0 */6 * * *', // A cada 6 horas
    },
  }
);

// Processar o job
queues.followUpWorker.on('completed', (job) => {
  console.log(`Follow-up job ${job.id} completed`);
});
```

### 3. Registrar rotas na API

Edite `apps/api/src/server.ts`:

```typescript
import { followUpRoutes } from './modules/followup/followup.controller';

// Registrar rotas
await app.register(followUpRoutes);
```

### 4. Deploy

```bash
git add .
git commit -m "feat: adiciona sistema de follow-up automático"
git push
```

## ⚙️ Configurações Avançadas

### Mudar frequência do Worker

Em `apps/worker/src/main.ts`:

```typescript
// A cada 6 horas (padrão)
pattern: '0 */6 * * *'

// A cada 3 horas
pattern: '0 */3 * * *'

// A cada 12 horas
pattern: '0 */12 * * *'

// 1x por dia às 10h
pattern: '0 10 * * *'
```

### Mudar intervalos de follow-up

Em `apps/worker/src/jobs/followup.job.ts`:

```typescript
const FOLLOWUP_SCHEDULE = [
  { hours: 12, message: 1 },   // 12 horas
  { hours: 48, message: 2 },   // 2 dias
  { hours: 120, message: 3 },  // 5 dias
];
```

### Adicionar mais follow-ups

1. Adicione a mensagem em `apps/worker/src/jobs/followup.job.ts`
2. Adicione o intervalo em `FOLLOWUP_SCHEDULE`
3. Aumente o limite em `followup.service.ts`:

```typescript
followup_count: {
  lt: 4, // Era 3, agora 4 follow-ups
}
```

## 📊 Monitoramento

### Ver usuários pendentes de follow-up
```bash
curl https://vip-miller-api.onrender.com/followup/pending
```

### Ver pagamentos abandonados
```bash
curl https://vip-miller-api.onrender.com/followup/abandoned-payments
```

### Logs do Worker
No Render → Worker → Logs, procure por:
```
🔄 Processing follow-ups...
✅ Follow-up 1 sent to user 123456789
✅ Abandoned payment reminder sent to user 987654321
```

## 🎯 Boas Práticas

1. **Não seja invasivo**: 3 follow-ups é o ideal
2. **Varie as mensagens**: Cada follow-up deve ter um ângulo diferente
3. **Teste os intervalos**: Comece com 24h, 3d, 7d
4. **Monitore conversões**: Veja qual follow-up converte mais
5. **Respeite o usuário**: Se ele não quer, não insista demais

## 🐛 Troubleshooting

**Follow-ups não estão sendo enviados:**
- Verifique se o Worker está rodando
- Verifique os logs do Worker
- Confirme que a migration foi executada

**Usuário recebeu follow-up mesmo depois de assinar:**
- Verifique se o webhook do SyncPay está funcionando
- Confirme que `resetFollowUps()` é chamado após pagamento

**Mensagens duplicadas:**
- Verifique se o Worker não está rodando em duplicata
- Confirme que `followup_count` está sendo incrementado
