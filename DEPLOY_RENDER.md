# 🚀 Deploy no Render - Guia Completo

## 📋 Pré-requisitos

- ✅ Conta no GitHub
- ✅ Conta no Render (https://render.com)
- ✅ PostgreSQL e Redis já criados no Render
- ✅ Repositório: https://github.com/elllllllbuilder/vip-miller

## 🗄️ Banco de Dados (Já Configurado)

### PostgreSQL
```
URL: postgresql://vip_postgres_user:CI6Ljk1nTWPVuDsSkpMOfEqLf2bnXkGL@dpg-d5nq52coud1c73a4r15g-a/vip_postgres
```

### Redis
```
URL: redis://red-d5nq5nmmcj7s73crud1g:6379
```

## 📦 Passo 1: Preparar Repositório GitHub

### 1.1 Inicializar Git (se ainda não fez)

```bash
git init
git add .
git commit -m "Initial commit: VIP System"
```

### 1.2 Adicionar Remote e Push

```bash
git remote add origin https://github.com/elllllllbuilder/vip-miller.git
git branch -M main
git push -u origin main
```

## 🚀 Passo 2: Deploy no Render

Você precisará criar **3 Web Services** no Render:

### 2.1 API (Web Service)

1. **Acesse:** https://dashboard.render.com
2. **Clique:** "New +" → "Web Service"
3. **Conecte:** Repositório `elllllllbuilder/vip-miller`
4. **Configure:**

```yaml
Name: vip-miller-api
Region: Oregon (US West)
Branch: main
Root Directory: apps/api
Runtime: Node
Build Command: npm install -g pnpm && pnpm install && pnpm prisma generate && pnpm build
Start Command: pnpm prisma migrate deploy && pnpm start
Instance Type: Free
```

5. **Environment Variables:**

```env
DATABASE_URL=postgresql://vip_postgres_user:CI6Ljk1nTWPVuDsSkpMOfEqLf2bnXkGL@dpg-d5nq52coud1c73a4r15g-a/vip_postgres
REDIS_URL=redis://red-d5nq5nmmcj7s73crud1g:6379
API_PORT=3000
API_URL=https://vip-miller-api.onrender.com
NODE_ENV=production
TELEGRAM_BOT_TOKEN=8567672373:AAHnR234cwYg9qcpkDHXoKeP1TZj80N1AXM
TELEGRAM_VIP_CHAT_ID=-5158395680
TELEGRAM_API_URL=https://api.telegram.org
SYNCPAY_API_KEY=f8c56a5d-e365-42d2-aca3-394d2b8348b3
SYNCPAY_WEBHOOK_SECRET=05466549-1474-46e9-92c0-36aa929f28a9
SYNCPAY_API_URL=https://api.syncpayments.com.br/
PLAN_MONTHLY_ID=monthly_vip
PLAN_MONTHLY_PRICE=2990
```

6. **Clique:** "Create Web Service"

### 2.2 Bot (Background Worker)

1. **Clique:** "New +" → "Background Worker"
2. **Conecte:** Repositório `elllllllbuilder/vip-miller`
3. **Configure:**

```yaml
Name: vip-miller-bot
Region: Oregon (US West)
Branch: main
Root Directory: apps/bot
Runtime: Node
Build Command: npm install -g pnpm && pnpm install && pnpm build
Start Command: pnpm start
Instance Type: Free
```

4. **Environment Variables:** (mesmas da API)

```env
DATABASE_URL=postgresql://vip_postgres_user:CI6Ljk1nTWPVuDsSkpMOfEqLf2bnXkGL@dpg-d5nq52coud1c73a4r15g-a/vip_postgres
REDIS_URL=redis://red-d5nq5nmmcj7s73crud1g:6379
API_URL=https://vip-miller-api.onrender.com
NODE_ENV=production
TELEGRAM_BOT_TOKEN=8567672373:AAHnR234cwYg9qcpkDHXoKeP1TZj80N1AXM
TELEGRAM_VIP_CHAT_ID=-5158395680
TELEGRAM_API_URL=https://api.telegram.org
```

5. **Clique:** "Create Background Worker"

### 2.3 Worker (Background Worker)

1. **Clique:** "New +" → "Background Worker"
2. **Conecte:** Repositório `elllllllbuilder/vip-miller`
3. **Configure:**

```yaml
Name: vip-miller-worker
Region: Oregon (US West)
Branch: main
Root Directory: apps/worker
Runtime: Node
Build Command: npm install -g pnpm && pnpm install && pnpm build
Start Command: pnpm start
Instance Type: Free
```

4. **Environment Variables:** (mesmas da API)

```env
DATABASE_URL=postgresql://vip_postgres_user:CI6Ljk1nTWPVuDsSkpMOfEqLf2bnXkGL@dpg-d5nq52coud1c73a4r15g-a/vip_postgres
REDIS_URL=redis://red-d5nq5nmmcj7s73crud1g:6379
API_URL=https://vip-miller-api.onrender.com
NODE_ENV=production
TELEGRAM_BOT_TOKEN=8567672373:AAHnR234cwYg9qcpkDHXoKeP1TZj80N1AXM
```

5. **Clique:** "Create Background Worker"

## 📝 Passo 3: Arquivos Necessários

### 3.1 Criar render.yaml (Opcional - Deploy Automático)

Crie na raiz do projeto:

```yaml
services:
  # API
  - type: web
    name: vip-miller-api
    runtime: node
    region: oregon
    plan: free
    buildCommand: cd apps/api && npm install -g pnpm && pnpm install && pnpm prisma generate && pnpm build
    startCommand: cd apps/api && pnpm prisma migrate deploy && pnpm start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: REDIS_URL
        sync: false
      - key: NODE_ENV
        value: production
      - key: API_PORT
        value: 3000

  # Bot
  - type: worker
    name: vip-miller-bot
    runtime: node
    region: oregon
    plan: free
    buildCommand: cd apps/bot && npm install -g pnpm && pnpm install && pnpm build
    startCommand: cd apps/bot && pnpm start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: TELEGRAM_BOT_TOKEN
        sync: false

  # Worker
  - type: worker
    name: vip-miller-worker
    runtime: node
    region: oregon
    plan: free
    buildCommand: cd apps/worker && npm install -g pnpm && pnpm install && pnpm build
    startCommand: cd apps/worker && pnpm start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: REDIS_URL
        sync: false
```

### 3.2 Atualizar package.json (apps/api)

Adicione script de start para produção:

```json
{
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js",
    "migrate": "prisma migrate deploy",
    "migrate:dev": "prisma migrate dev",
    "generate": "prisma generate"
  }
}
```

### 3.3 Atualizar package.json (apps/bot)

```json
{
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js"
  }
}
```

### 3.4 Atualizar package.json (apps/worker)

```json
{
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js"
  }
}
```

## 🔧 Passo 4: Configurar Webhook da SyncPay

Após o deploy da API, configure o webhook:

1. **Acesse:** Painel da SyncPay
2. **Configure Webhook URL:**
   ```
   https://vip-miller-api.onrender.com/webhooks/syncpay
   ```
3. **Eventos:** Selecione `charge.paid`
4. **Secret:** Use o mesmo do .env (`SYNCPAY_WEBHOOK_SECRET`)

## 🤖 Passo 5: Configurar Bot no Grupo VIP

1. **Adicione o bot ao grupo VIP**
2. **Torne-o administrador** com permissões:
   - ✅ Convidar usuários via link
   - ✅ Banir usuários
3. **Verifique o CHAT_ID** está correto no .env

## ✅ Passo 6: Verificar Deploy

### 6.1 Verificar API

```bash
curl https://vip-miller-api.onrender.com/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "...",
  "database": "connected"
}
```

### 6.2 Verificar Bot

1. Abra o Telegram
2. Envie `/start` para @bblondeebot
3. Deve receber resposta

### 6.3 Verificar Logs

No Render Dashboard:
- Acesse cada serviço
- Clique em "Logs"
- Verifique se não há erros

## 🐛 Troubleshooting

### Erro: "Cannot find module"

**Solução:** Verifique se o build command inclui `pnpm install`

### Erro: "Prisma Client not generated"

**Solução:** Adicione `pnpm prisma generate` no build command

### Erro: "Port already in use"

**Solução:** Render usa a variável `PORT` automaticamente. Atualize o código:

```typescript
// apps/api/src/main.ts
const port = process.env.PORT || env.API_PORT;
await fastify.listen({ port: Number(port), host: '0.0.0.0' });
```

### Erro: "Database connection failed"

**Solução:** Verifique se a DATABASE_URL está correta nas variáveis de ambiente

### Bot não responde

**Solução:** 
1. Verifique logs do worker bot
2. Verifique se TELEGRAM_BOT_TOKEN está correto
3. Teste o token: `curl https://api.telegram.org/bot<TOKEN>/getMe`

## 📊 Monitoramento

### Logs em Tempo Real

No Render Dashboard:
1. Selecione o serviço
2. Clique em "Logs"
3. Logs aparecem em tempo real

### Métricas

No Render Dashboard:
1. Selecione o serviço
2. Clique em "Metrics"
3. Veja CPU, memória, requests

## 🔄 Atualizações

### Deploy Automático

Render faz deploy automático quando você faz push para o GitHub:

```bash
git add .
git commit -m "Update: nova feature"
git push origin main
```

### Deploy Manual

No Render Dashboard:
1. Selecione o serviço
2. Clique em "Manual Deploy"
3. Selecione a branch
4. Clique em "Deploy"

## 💰 Custos

### Plano Free (Atual)

- ✅ 750 horas/mês por serviço
- ✅ PostgreSQL: 1GB
- ✅ Redis: 25MB
- ⚠️ Serviços dormem após 15min de inatividade
- ⚠️ Acordam automaticamente ao receber request

### Plano Pago (Recomendado para Produção)

- ✅ Serviços sempre ativos
- ✅ Mais recursos
- ✅ Melhor performance
- 💵 A partir de $7/mês por serviço

## 🎯 Checklist Final

- [ ] Repositório no GitHub atualizado
- [ ] 3 serviços criados no Render (API, Bot, Worker)
- [ ] Variáveis de ambiente configuradas
- [ ] Migrations rodadas com sucesso
- [ ] API respondendo em /health
- [ ] Bot respondendo no Telegram
- [ ] Worker agendando jobs
- [ ] Webhook da SyncPay configurado
- [ ] Bot é admin do grupo VIP
- [ ] Testes de pagamento realizados

## 🎉 Pronto!

Seu sistema VIP está no ar e funcionando em produção!

**URLs:**
- API: https://vip-miller-api.onrender.com
- Health: https://vip-miller-api.onrender.com/health
- Webhook: https://vip-miller-api.onrender.com/webhooks/syncpay

**Próximos passos:**
1. Teste o fluxo completo
2. Configure monitoramento
3. Configure backup do banco
4. Documente processos

---

**Dúvidas?** Consulte a documentação do Render: https://render.com/docs
