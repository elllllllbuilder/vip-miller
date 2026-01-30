# Deploy no SquareCloud

## ⚠️ Limitações Importantes

SquareCloud **NÃO** oferece:
- ❌ PostgreSQL
- ❌ Redis
- ❌ Múltiplos serviços no mesmo plano

**Solução:** Usar SquareCloud apenas para Bot/Worker + bancos externos

## 🎯 Arquitetura Híbrida Recomendada

```
SquareCloud: Bot + Worker
Render (grátis): PostgreSQL + Redis + API
```

## 🚀 Setup

### 1. Preparar Bancos de Dados (Render)

1. Crie conta no Render: https://render.com
2. Crie PostgreSQL (grátis)
3. Crie Redis (grátis)
4. Anote as URLs de conexão

### 2. Deploy da API (Render)

Siga o guia `DEPLOY_RENDER.md` para subir a API no Render.

### 3. Preparar Bot para SquareCloud

Crie `apps/bot/squarecloud.app`:

```ini
DISPLAY_NAME=VIP Bot
DESCRIPTION=Bot Telegram VIP System
MAIN=dist/main.js
MEMORY=512
VERSION=recommended
SUBDOMAIN=vip-bot
```

Crie `apps/bot/squarecloud.config`:

```ini
BUILD=pnpm install && pnpm build
START=node dist/main.js
```

### 4. Preparar Worker para SquareCloud

Crie `apps/worker/squarecloud.app`:

```ini
DISPLAY_NAME=VIP Worker
DESCRIPTION=Worker de Renovações
MAIN=dist/main.js
MEMORY=512
VERSION=recommended
```

### 5. Variáveis de Ambiente

No painel do SquareCloud, adicione:

**Bot:**
```env
TELEGRAM_BOT_TOKEN=seu_token
TELEGRAM_VIP_CHAT_ID=-1003420366019
TELEGRAM_API_URL=https://api.telegram.org
API_URL=https://sua-api.onrender.com
NODE_ENV=production
```

**Worker:**
```env
REDIS_URL=redis://seu-redis.onrender.com:6379
API_URL=https://sua-api.onrender.com
TELEGRAM_BOT_TOKEN=seu_token
NODE_ENV=production
```

### 6. Deploy

```bash
# Bot
cd apps/bot
pnpm build
zip -r bot.zip dist/ package.json node_modules/

# Worker
cd apps/worker
pnpm build
zip -r worker.zip dist/ package.json node_modules/
```

Upload os ZIPs no painel do SquareCloud.

## 💰 Custos

- **SquareCloud**: ~R$ 10-20/mês por aplicação
- **Render (grátis)**: PostgreSQL + Redis + API
- **Total**: ~R$ 20-40/mês

## ⚠️ Problemas do SquareCloud

1. **Sem PostgreSQL/Redis nativo**
   - Precisa usar serviços externos
   - Latência maior

2. **Sem suporte a monorepo**
   - Precisa fazer build manual
   - Não detecta mudanças automaticamente

3. **Logs limitados**
   - Difícil debugar problemas

4. **Sem HTTPS customizado**
   - Webhooks podem ter problemas

## 🎯 Recomendação Final

**NÃO use SquareCloud para este projeto.**

Use uma destas alternativas:

### Opção 1: Railway (Melhor)
- ✅ Tudo em um lugar
- ✅ Setup em 5 minutos
- ✅ $5/mês de crédito grátis
- ✅ Suporte a monorepo

### Opção 2: Render (Grátis)
- ✅ Plano gratuito completo
- ✅ PostgreSQL + Redis inclusos
- ⚠️ Sleep após inatividade
- ✅ Você já tem configurado!

### Opção 3: VPS (Controle Total)
- ✅ Performance máxima
- ✅ Sem limitações
- 💰 $4-6/mês
- 🔧 Requer conhecimento técnico

## 📊 Comparação de Plataformas

| Plataforma | PostgreSQL | Redis | Monorepo | Preço | Facilidade |
|------------|------------|-------|----------|-------|------------|
| Railway | ✅ | ✅ | ✅ | $5/mês | ⭐⭐⭐⭐⭐ |
| Render | ✅ | ✅ | ✅ | Grátis* | ⭐⭐⭐⭐ |
| SquareCloud | ❌ | ❌ | ❌ | R$20/mês | ⭐⭐ |
| Fly.io | ✅ | ✅ | ✅ | Grátis* | ⭐⭐⭐ |
| VPS | ✅ | ✅ | ✅ | $5/mês | ⭐⭐ |

*Com limitações

## 🔗 Links Úteis

- Railway: https://railway.app
- Render: https://render.com
- Fly.io: https://fly.io
- DigitalOcean: https://digitalocean.com
