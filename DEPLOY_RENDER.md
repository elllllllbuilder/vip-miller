# 🚀 Deploy no Render - Guia Completo

## 📋 Variáveis de Ambiente para o Render

### Copie e cole estas variáveis no painel do Render:

```env
# Database (será fornecido pelo Render PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# Redis (use Upstash Redis - gratuito)
REDIS_URL=redis://default:password@host:port

# API Configuration
NODE_ENV=production
API_PORT=10000
API_URL=https://seu-app-name.onrender.com

# Telegram Bot
TELEGRAM_BOT_TOKEN=8567672373:AAHnR234cwYg9qcpkDHXoKeP1TZj80N1AXM
TELEGRAM_VIP_CHAT_ID=-5158395680
TELEGRAM_API_URL=https://api.telegram.org

# SyncPay
SYNCPAY_API_KEY=f8c56a5d-e365-42d2-aca3-394d2b8348b3
SYNCPAY_WEBHOOK_SECRET=05466549-1474-46e9-92c0-36aa929f28a9
SYNCPAY_API_URL=https://api.syncpayments.com.br/

# Plans
PLAN_MONTHLY_ID=monthly_vip
PLAN_MONTHLY_PRICE=2990
```

## 🔧 Passo a Passo no Render

### 1. Criar Conta no Render
- Acesse: https://render.com
- Faça login com GitHub

### 2. Criar PostgreSQL Database
1. **Dashboard → New → PostgreSQL**
2. **Name:** `vip-system-db`
3. **Database:** `vip_system`
4. **User:** `vip_user`
5. **Region:** Oregon (US West)
6. **Plan:** Free
7. **Create Database**

**Após criar, copie a `DATABASE_URL` interna**

### 3. Configurar Redis (Upstash - Gratuito)
1. **Acesse:** https://upstash.com
2. **Crie conta gratuita**
3. **Create Database**
4. **Name:** `vip-redis`
5. **Region:** us-east-1
6. **Copy** a `REDIS_URL`

### 4. Criar Web Service (API + Bot + Worker)
1. **Dashboard → New → Web Service**
2. **Connect Repository:** Seu repositório GitHub
3. **Name:** `vip-system-api`
4. **Region:** Oregon (US West)
5. **Branch:** `main`
6. **Root Directory:** deixe vazio
7. **Runtime:** Node
8. **Build Command:**
   ```bash
   npm install -g pnpm && pnpm install && pnpm build
   ```
9. **Start Command:**
   ```bash
   pnpm --filter api start
   ```
10. **Plan:** Free
11. **Advanced → Add Environment Variables**

### 5. Adicionar Variáveis de Ambiente

**No painel do Render, adicione uma por uma:**

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://...` (da etapa 2) |
| `REDIS_URL` | `redis://...` (da etapa 3) |
| `NODE_ENV` | `production` |
| `API_PORT` | `10000` |
| `API_URL` | `https://vip-system-api.onrender.com` |
| `TELEGRAM_BOT_TOKEN` | `8567672373:AAHnR234cwYg9qcpkDHXoKeP1TZj80N1AXM` |
| `TELEGRAM_VIP_CHAT_ID` | `-5158395680` |
| `TELEGRAM_API_URL` | `https://api.telegram.org` |
| `SYNCPAY_API_KEY` | `f8c56a5d-e365-42d2-aca3-394d2b8348b3` |
| `SYNCPAY_WEBHOOK_SECRET` | `05466549-1474-46e9-92c0-36aa929f28a9` |
| `SYNCPAY_API_URL` | `https://api.syncpayments.com.br/` |
| `PLAN_MONTHLY_ID` | `monthly_vip` |
| `PLAN_MONTHLY_PRICE` | `2990` |

### 6. Criar Background Worker (Separado)
1. **Dashboard → New → Background Worker**
2. **Connect Repository:** Mesmo repositório
3. **Name:** `vip-system-worker`
4. **Region:** Oregon (US West)
5. **Branch:** `main`
6. **Build Command:**
   ```bash
   npm install -g pnpm && pnpm install && pnpm build
   ```
7. **Start Command:**
   ```bash
   pnpm --filter worker start
   ```
8. **Add as mesmas variáveis de ambiente**

### 7. Criar Bot Service (Separado)
1. **Dashboard → New → Background Worker**
2. **Connect Repository:** Mesmo repositório
3. **Name:** `vip-system-bot`
4. **Region:** Oregon (US West)
5. **Branch:** `main`
6. **Build Command:**
   ```bash
   npm install -g pnpm && pnpm install && pnpm build
   ```
7. **Start Command:**
   ```bash
   pnpm --filter bot start
   ```
8. **Add as mesmas variáveis de ambiente**

## 📝 Arquivos Necessários para Deploy

### 1. Criar `render.yaml` (opcional)
```yaml
services:
  - type: web
    name: vip-system-api
    env: node
    buildCommand: npm install -g pnpm && pnpm install && pnpm build
    startCommand: pnpm --filter api start
    
  - type: worker
    name: vip-system-bot
    env: node
    buildCommand: npm install -g pnpm && pnpm install && pnpm build
    startCommand: pnpm --filter bot start
    
  - type: worker
    name: vip-system-worker
    env: node
    buildCommand: npm install -g pnpm && pnpm install && pnpm build
    startCommand: pnpm --filter worker start

databases:
  - name: vip-system-db
    databaseName: vip_system
    user: vip_user
```

### 2. Atualizar `package.json` (raiz)
```json
{
  "scripts": {
    "build": "pnpm -r build",
    "start:api": "pnpm --filter api start",
    "start:bot": "pnpm --filter bot start",
    "start:worker": "pnpm --filter worker start"
  }
}
```

### 3. Criar `apps/api/package.json` start script
```json
{
  "scripts": {
    "start": "node dist/main.js"
  }
}
```

## 🔄 Processo de Deploy

### 1. Preparar Código
```bash
# Fazer commit das mudanças
git add .
git commit -m "Deploy: Configuração para produção"
git push origin main
```

### 2. Deploy Automático
- Render detecta push no GitHub
- Executa build automaticamente
- Inicia serviços

### 3. Rodar Migrations
**Após primeiro deploy, no Shell do Render:**
```bash
cd apps/api
npx prisma migrate deploy
```

## 🧪 Testar Deploy

### 1. Verificar API
```
https://vip-system-api.onrender.com/health
```

### 2. Testar Bot
- Envie `/start` no Telegram
- Deve funcionar normalmente

### 3. Configurar Webhook SyncPay
- URL: `https://vip-system-api.onrender.com/webhooks/syncpay`

## ⚠️ Limitações do Plano Gratuito

### Render Free Tier
- **Sleep após 15min** de inatividade
- **750 horas/mês** por serviço
- **Restart automático** quando recebe request

### Soluções
1. **Usar cron job** para manter ativo:
   ```bash
   # A cada 10 minutos
   */10 * * * * curl https://vip-system-api.onrender.com/health
   ```

2. **Upgrade para pago** ($7/mês por serviço)

## 🔧 Comandos Úteis

### Ver Logs
```bash
# No painel do Render → Logs
```

### Executar Migrations
```bash
# No Shell do Render
cd apps/api
npx prisma migrate deploy
```

### Restart Serviços
```bash
# No painel do Render → Manual Deploy
```

## 📊 Monitoramento

### Health Checks
- API: `https://seu-app.onrender.com/health`
- Logs: Painel do Render

### Uptime Monitoring
- Use UptimeRobot (gratuito)
- Monitore: `https://seu-app.onrender.com/health`

## 🚨 Troubleshooting

### Build Falha
```bash
# Verificar se pnpm está instalado
npm install -g pnpm
```

### Database Connection
```bash
# Verificar DATABASE_URL
echo $DATABASE_URL
```

### Bot Não Responde
```bash
# Verificar se Background Worker está rodando
# Logs → vip-system-bot
```

## 💰 Custos Estimados

### Gratuito (com limitações)
- **PostgreSQL:** Free (1GB)
- **Redis:** Upstash Free (10k requests/day)
- **Web Service:** Free (750h/mês)
- **Background Workers:** Free (750h/mês cada)

### Pago (recomendado para produção)
- **PostgreSQL:** $7/mês (256MB RAM)
- **Redis:** Upstash Pro $20/mês
- **Web Service:** $7/mês
- **Background Workers:** $7/mês cada
- **Total:** ~$48/mês

## ✅ Checklist de Deploy

- [ ] Repositório no GitHub
- [ ] Conta no Render criada
- [ ] PostgreSQL database criado
- [ ] Redis configurado (Upstash)
- [ ] Web Service criado
- [ ] Background Workers criados
- [ ] Variáveis de ambiente configuradas
- [ ] Primeiro deploy realizado
- [ ] Migrations executadas
- [ ] API respondendo (`/health`)
- [ ] Bot funcionando no Telegram
- [ ] Webhook SyncPay configurado

## 🎉 Pronto!

Seu sistema VIP está rodando em produção no Render!

**URLs importantes:**
- **API:** https://vip-system-api.onrender.com
- **Health:** https://vip-system-api.onrender.com/health
- **Webhook:** https://vip-system-api.onrender.com/webhooks/syncpay

**Próximos passos:**
1. Configurar webhook na SyncPay
2. Testar fluxo completo
3. Configurar monitoramento
4. Fazer backup do banco