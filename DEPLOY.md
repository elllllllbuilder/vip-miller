# 🚀 Deploy Rápido - VIP System

## Opção 1: Railway (Recomendado - Mais Fácil)

### Passo a Passo:

1. **Criar conta no Railway**
   - Acesse: https://railway.app
   - Faça login com GitHub

2. **Criar novo projeto**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Conecte seu repositório

3. **Adicionar PostgreSQL**
   - No projeto, clique em "+ New"
   - Selecione "Database" → "PostgreSQL"
   - Copie a `DATABASE_URL` gerada

4. **Adicionar Redis**
   - Clique em "+ New"
   - Selecione "Database" → "Redis"
   - Copie a `REDIS_URL` gerada

5. **Configurar Variáveis de Ambiente**
   - Clique no serviço da API
   - Vá em "Variables"
   - Adicione todas as variáveis do `.env`:

```env
NODE_ENV=production
DATABASE_URL=<copiado do Railway>
REDIS_URL=<copiado do Railway>
API_PORT=3000
TELEGRAM_BOT_TOKEN=seu_token
TELEGRAM_VIP_CHAT_ID=seu_chat_id
SYNCPAY_API_KEY=sua_key
SYNCPAY_WEBHOOK_SECRET=seu_secret
SYNCPAY_API_URL=https://api.syncpayments.com.br/
PLAN_MONTHLY_ID=monthly_vip
PLAN_MONTHLY_PRICE=2990
```

6. **Deploy**
   - Railway fará deploy automaticamente
   - Aguarde ~5 minutos
   - Copie a URL gerada (ex: `https://vip-system-api.up.railway.app`)

7. **Configurar Webhook na SyncPay**
   - URL: `https://sua-url.railway.app/webhooks/syncpay`

---

## Opção 2: Render (Gratuito)

### Passo a Passo:

1. **Criar conta no Render**
   - Acesse: https://render.com
   - Faça login com GitHub

2. **Criar PostgreSQL**
   - Dashboard → "New +"
   - Selecione "PostgreSQL"
   - Nome: `vip-postgres`
   - Copie a `Internal Database URL`

3. **Criar Redis**
   - Dashboard → "New +"
   - Selecione "Redis"
   - Nome: `vip-redis`
   - Copie a `Internal Redis URL`

4. **Criar Web Service (API)**
   - Dashboard → "New +"
   - Selecione "Web Service"
   - Conecte seu repositório
   - Configurações:
     - **Name:** vip-system-api
     - **Root Directory:** (deixe vazio)
     - **Build Command:**
       ```bash
       pnpm install && cd apps/api && pnpm prisma generate && pnpm prisma migrate deploy
       ```
     - **Start Command:**
       ```bash
       pnpm --filter api start
       ```

5. **Adicionar Variáveis de Ambiente**
   - Na página do serviço, vá em "Environment"
   - Adicione todas as variáveis do `.env`

6. **Criar Background Workers**
   
   **Bot:**
   - Dashboard → "New +" → "Background Worker"
   - Nome: `vip-system-bot`
   - Start Command: `pnpm --filter bot start`
   
   **Worker:**
   - Dashboard → "New +" → "Background Worker"
   - Nome: `vip-system-worker`
   - Start Command: `pnpm --filter worker start`

7. **Copiar URL**
   - A URL será algo como: `https://vip-system-api.onrender.com`

8. **Configurar Webhook na SyncPay**
   - URL: `https://vip-system-api.onrender.com/webhooks/syncpay`

---

## Opção 3: Vercel (Apenas para API)

⚠️ **Limitação:** Vercel é serverless, não suporta bot e worker rodando continuamente.

### Apenas se quiser testar a API:

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd apps/api
   vercel
   ```

3. **Configurar variáveis**
   ```bash
   vercel env add DATABASE_URL
   vercel env add REDIS_URL
   # ... adicionar todas
   ```

---

## Opção 4: VPS (DigitalOcean, Linode, etc.)

### Se você tem um VPS:

1. **Conectar via SSH**
   ```bash
   ssh root@seu-ip
   ```

2. **Instalar Node.js e pnpm**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt-get install -y nodejs
   npm install -g pnpm
   ```

3. **Instalar Docker**
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```

4. **Clonar repositório**
   ```bash
   git clone seu-repositorio
   cd vip-system
   ```

5. **Configurar .env**
   ```bash
   nano .env
   # Cole suas variáveis
   ```

6. **Iniciar**
   ```bash
   docker-compose up -d
   pnpm install
   cd apps/api && pnpm prisma migrate deploy && cd ../..
   pnpm build
   
   # Usar PM2 para manter rodando
   npm install -g pm2
   pm2 start "pnpm --filter api start" --name api
   pm2 start "pnpm --filter bot start" --name bot
   pm2 start "pnpm --filter worker start" --name worker
   pm2 save
   pm2 startup
   ```

7. **Configurar Nginx**
   ```bash
   apt install nginx
   nano /etc/nginx/sites-available/vip-system
   ```

   ```nginx
   server {
       listen 80;
       server_name seu-dominio.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   ln -s /etc/nginx/sites-available/vip-system /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

8. **SSL com Certbot**
   ```bash
   apt install certbot python3-certbot-nginx
   certbot --nginx -d seu-dominio.com
   ```

---

## 🎯 Recomendação

**Para começar rápido:** Use **Railway**
- ✅ Mais fácil
- ✅ Deploy automático
- ✅ PostgreSQL e Redis inclusos
- ✅ $5 grátis por mês
- ✅ URL HTTPS automática

**Depois de testar:** Migre para VPS se precisar de mais controle

---

## 📝 Checklist Pós-Deploy

- [ ] API respondendo em `/health`
- [ ] Bot respondendo no Telegram
- [ ] Worker agendando jobs
- [ ] Webhook configurado na SyncPay
- [ ] Testar pagamento completo
- [ ] Verificar logs
- [ ] Configurar monitoramento

---

## 🆘 Problemas Comuns

### Build falha
- Verifique se todas as variáveis de ambiente estão configuradas
- Verifique logs do build

### Bot não responde
- Verifique se TELEGRAM_BOT_TOKEN está correto
- Verifique logs do worker do bot

### Webhook não funciona
- Verifique se URL está correta na SyncPay
- Verifique se SYNCPAY_WEBHOOK_SECRET está correto
- Teste manualmente: `curl -X POST https://sua-url/webhooks/syncpay`

---

## 💡 Dica

Comece com Railway, é o mais rápido! Em 10 minutos você terá tudo rodando com domínio HTTPS.
