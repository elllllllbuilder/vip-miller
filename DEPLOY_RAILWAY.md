# Deploy no Railway

## 🚀 Setup Rápido (5 minutos)

### 1. Criar Conta
- Acesse https://railway.app
- Login com GitHub

### 2. Criar Projeto
1. Click em "New Project"
2. Escolha "Deploy from GitHub repo"
3. Selecione seu repositório

### 3. Adicionar Serviços

#### PostgreSQL
1. Click em "+ New"
2. Escolha "Database" → "PostgreSQL"
3. Railway cria automaticamente

#### Redis
1. Click em "+ New"
2. Escolha "Database" → "Redis"
3. Railway cria automaticamente

### 4. Configurar Aplicações

#### API
1. Click em "+ New" → "GitHub Repo"
2. Em "Settings":
   - **Root Directory**: `apps/api`
   - **Build Command**: `pnpm install && pnpm --filter api build`
   - **Start Command**: `cd apps/api && pnpm migrate && pnpm start`
3. Adicionar variáveis de ambiente (veja abaixo)

#### Bot
1. Click em "+ New" → "GitHub Repo"
2. Em "Settings":
   - **Root Directory**: `apps/bot`
   - **Build Command**: `pnpm install && pnpm --filter bot build`
   - **Start Command**: `cd apps/bot && pnpm start`
3. Adicionar variáveis de ambiente

#### Worker
1. Click em "+ New" → "GitHub Repo"
2. Em "Settings":
   - **Root Directory**: `apps/worker`
   - **Build Command**: `pnpm install && pnpm --filter worker build`
   - **Start Command**: `cd apps/worker && pnpm start`
3. Adicionar variáveis de ambiente

### 5. Variáveis de Ambiente

Railway gera automaticamente:
- `DATABASE_URL` (do PostgreSQL)
- `REDIS_URL` (do Redis)

Você precisa adicionar manualmente em CADA serviço:

```env
# Telegram
TELEGRAM_BOT_TOKEN=seu_token_aqui
TELEGRAM_VIP_CHAT_ID=-1003420366019
TELEGRAM_API_URL=https://api.telegram.org

# SyncPay
SYNCPAY_CLIENT_ID=seu_client_id
SYNCPAY_CLIENT_SECRET=seu_client_secret
SYNCPAY_API_URL=https://api.syncpayments.com.br
SYNCPAY_MOCK_MODE=false

# Plans
PLAN_MONTHLY_ID=monthly_vip
PLAN_MONTHLY_PRICE=2990

# API (apenas no serviço API)
API_PORT=3000
NODE_ENV=production

# API_URL (apenas no Bot e Worker)
API_URL=${{API.url}}  # Railway injeta automaticamente
```

### 6. Configurar Webhook SyncPay

1. Pegue a URL pública da API no Railway
2. Configure no painel SyncPay:
   ```
   https://seu-projeto.up.railway.app/webhooks/syncpay
   ```

### 7. Deploy

Railway faz deploy automático quando você:
- Faz push no GitHub
- Muda variáveis de ambiente
- Click em "Deploy"

## 💰 Custos

- **Plano Gratuito**: $5 de crédito/mês
- **Plano Hobby**: $5/mês + uso
- Estimativa: ~$3-8/mês dependendo do uso

## 🔍 Monitoramento

Railway oferece:
- Logs em tempo real
- Métricas de CPU/RAM
- Restart automático em caso de falha

## ⚡ Vantagens do Railway

✅ Setup mais rápido que Render
✅ Interface mais intuitiva
✅ Logs melhores
✅ Deploy mais rápido
✅ Suporte a monorepo nativo
✅ Variáveis compartilhadas entre serviços

## 🆚 Railway vs Render

| Feature | Railway | Render |
|---------|---------|--------|
| Setup | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Interface | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Logs | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Preço | $5/mês | Grátis* |
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

*Render tem plano gratuito mas com limitações (sleep após inatividade)

## 🐛 Troubleshooting

### Build falha
```bash
# Certifique-se que o Root Directory está correto
# Railway precisa do pnpm-workspace.yaml na raiz
```

### Migrations não rodam
```bash
# Adicione ao Start Command:
pnpm migrate && pnpm start
```

### Bot não conecta
```bash
# Verifique se TELEGRAM_BOT_TOKEN está correto
# Verifique se API_URL aponta para o serviço da API
```

## 📚 Recursos

- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app
