# 🧪 Teste do Sistema de Follow-up

## 📅 Cronograma de Mensagens

Quando você envia `/start` e não paga, recebe mensagens automáticas:

| Tempo | Mensagem |
|-------|----------|
| **2 minutos** | "Oi! Notei que você ainda não garantiu..." |
| **10 minutos** | "Não perca essa oportunidade!" |
| **30 minutos** | "Última chance de aproveitar!" |
| **24 horas** | "Já se passou 24 horas..." |
| **48 horas** | "Lembrete importante! Faz 2 dias..." |
| **72 horas** | "ÚLTIMA OPORTUNIDADE! Já faz 3 dias..." |

## 🚀 Como Testar

### 1. Fazer Deploy
```bash
git add .
git commit -m "feat: implementa sistema de follow-up completo"
git push
```

### 2. Rodar Migration no Render

**Opção A - Via Shell (Recomendado):**
1. Acesse https://dashboard.render.com
2. Click em **vip-system-api**
3. Click na aba **Shell**
4. Rode:
```bash
cd apps/api
pnpm prisma migrate deploy
pnpm prisma migrate status
```

**Opção B - Automático:**
A migration roda automaticamente no próximo deploy da API.

### 3. Testar no Telegram

1. **Envie `/start` para o bot**
2. **NÃO clique em "Assinar"** (ou clique mas não pague)
3. **Aguarde 2 minutos** → Primeira mensagem chega!
4. **Aguarde 10 minutos** → Segunda mensagem
5. **Aguarde 30 minutos** → Terceira mensagem

## 📊 Monitorar os Logs

### Logs do Worker (Render)
```
🔄 Processing follow-ups...
✅ Follow-up 1 sent to user 123456789
✅ Follow-up 2 sent to user 123456789
```

### Verificar no Shell da API
```bash
# Ver usuários pendentes de follow-up
curl https://vip-system-api.onrender.com/followup/pending

# Ver quantos follow-ups cada usuário recebeu
cd apps/api
pnpm prisma studio
# Abra a tabela user_states e veja followup_count
```

## ⏱️ Intervalos Configurados

```javascript
2 minutos   = 2 min
10 minutos  = 10 min
30 minutos  = 30 min
24 horas    = 1440 min
48 horas    = 2880 min
72 horas    = 4320 min
```

## 🛑 Sistema Para Quando:

- ✅ Usuário assina e paga
- ✅ Já enviou 6 follow-ups
- ✅ Usuário entra no grupo VIP

## 🔧 Ajustar Intervalos

Edite `apps/worker/src/jobs/followup.job.ts`:

```javascript
const FOLLOWUP_SCHEDULE = [
  { minutes: 2, message: 1 },    // Altere aqui
  { minutes: 10, message: 2 },   // Altere aqui
  { minutes: 30, message: 3 },   // Altere aqui
  { minutes: 1440, message: 4 }, // 24h
  { minutes: 2880, message: 5 }, // 48h
  { minutes: 4320, message: 6 }, // 72h
];
```

## 🎯 Ajustar Frequência do Worker

O Worker verifica a cada **5 minutos** se tem follow-ups para enviar.

Para mudar, edite `apps/worker/src/main.ts`:

```javascript
// A cada 5 minutos (padrão para testes)
pattern: '*/5 * * * *'

// A cada 1 minuto (mais rápido)
pattern: '*/1 * * * *'

// A cada 10 minutos
pattern: '*/10 * * * *'

// A cada hora
pattern: '0 * * * *'
```

## 📝 Personalizar Mensagens

Edite `apps/worker/src/jobs/followup.job.ts` na função `sendFollowUpMessage`:

```javascript
const messages = [
  { text: `Sua mensagem 1 aqui...` },
  { text: `Sua mensagem 2 aqui...` },
  // ... etc
];
```

## 🐛 Troubleshooting

### "Não recebi nenhuma mensagem"
1. Verifique se a migration rodou: `pnpm prisma migrate status`
2. Verifique os logs do Worker no Render
3. Confirme que o Worker está rodando (não em "Failed")
4. Verifique se você enviou `/start` (isso registra no banco)

### "Recebi mensagens duplicadas"
- O Worker pode estar rodando em duplicata
- Verifique se tem apenas 1 instância do Worker no Render

### "Mensagens não param de chegar"
- Verifique se o webhook do SyncPay está funcionando
- Confirme que `resetFollowUps()` é chamado após pagamento

## ✅ Checklist de Deploy

- [ ] Commit e push do código
- [ ] Migration rodada no banco
- [ ] API deployed
- [ ] Worker deployed
- [ ] Bot deployed
- [ ] Testado enviando `/start`
- [ ] Primeira mensagem recebida em 2 minutos

## 🎉 Pronto!

Agora você tem um sistema completo de follow-up automático funcionando!

O sistema vai recuperar usuários que não assinaram e aumentar suas conversões. 🚀
