# Troubleshooting - Soluções para Problemas Comuns

## ❌ Erros Vermelhos no VS Code (TypeScript)

### Problema
Arquivos como `env.ts` aparecem com erros vermelhos:
- `Cannot find module 'dotenv'`
- `Cannot find module '@vip-system/shared'`

### Causa
As dependências ainda não foram instaladas.

### Solução
```bash
# Instalar todas as dependências
pnpm install

# Recarregar a janela do VS Code
# Pressione Ctrl+Shift+P e digite "Reload Window"
```

### Por que isso acontece?
É completamente normal! Quando você clona um projeto Node.js/TypeScript, os módulos não vêm incluídos. Você precisa instalá-los primeiro com `pnpm install`.

---

## 🐳 Docker não inicia

### Problema
`docker-compose up -d` falha ou containers não iniciam.

### Soluções

**1. Verificar se Docker está rodando:**
```bash
docker ps
```

**2. Verificar portas em uso:**
```bash
# Windows
netstat -ano | findstr :5432
netstat -ano | findstr :6379

# Linux/Mac
lsof -i :5432
lsof -i :6379
```

**3. Parar containers existentes:**
```bash
docker-compose down
docker-compose up -d
```

**4. Remover volumes e reiniciar:**
```bash
docker-compose down -v
docker-compose up -d
```

---

## 🗄️ Erro no Prisma

### Problema
`Prisma Client is not generated` ou erros relacionados ao Prisma.

### Solução
```bash
cd apps/api
pnpm prisma generate
pnpm prisma migrate dev
cd ../..
```

### Se persistir:
```bash
cd apps/api
rm -rf node_modules
pnpm install
pnpm prisma generate
cd ../..
```

---

## 🤖 Bot não responde

### Problema
Bot não responde ao comando `/start`.

### Checklist

**1. Verificar token:**
```bash
# Testar token manualmente
curl https://api.telegram.org/bot<SEU_TOKEN>/getMe
```

**2. Verificar logs:**
```bash
pnpm --filter bot dev
# Procure por erros nos logs
```

**3. Verificar .env:**
```env
TELEGRAM_BOT_TOKEN=seu_token_aqui  # Sem espaços!
```

**4. Reiniciar bot:**
```bash
# Pare o bot (Ctrl+C) e inicie novamente
pnpm --filter bot dev
```

---

## 🔗 Erro ao obter TELEGRAM_VIP_CHAT_ID

### Problema
Não consegue encontrar o ID do grupo VIP.

### Solução Passo a Passo

**1. Adicione o bot ao grupo**

**2. Envie uma mensagem no grupo**
Qualquer mensagem serve, exemplo: "teste"

**3. Acesse a URL:**
```
https://api.telegram.org/bot<SEU_TOKEN>/getUpdates
```

**4. Procure por:**
```json
{
  "chat": {
    "id": -1001234567890,  // Este é o ID que você precisa!
    "type": "supergroup",
    "title": "Grupo VIP"
  }
}
```

**5. Use o ID no .env:**
```env
TELEGRAM_VIP_CHAT_ID=-1001234567890
```

**Importante:** O ID deve ser um número negativo!

---

## 💳 Webhook não funciona

### Problema
Pagamentos não são confirmados automaticamente.

### Checklist

**1. Verificar assinatura:**
```bash
# Logs da API devem mostrar:
# "Webhook signature validated"
```

**2. Testar webhook localmente:**
```bash
curl -X POST http://localhost:3000/webhooks/syncpay \
  -H "Content-Type: application/json" \
  -H "X-SyncPay-Signature: test" \
  -d '{
    "event": "charge.paid",
    "charge_id": "test_123",
    "status": "paid"
  }'
```

**3. Usar ngrok para testes:**
```bash
# Instalar ngrok
# Expor API localmente
ngrok http 3000

# Configurar webhook na SyncPay com URL do ngrok
https://seu-id.ngrok.io/webhooks/syncpay
```

---

## 🔄 Worker não envia mensagens

### Problema
Lembretes de renovação não são enviados.

### Checklist

**1. Verificar Redis:**
```bash
docker exec -it vip-redis redis-cli ping
# Deve retornar: PONG
```

**2. Verificar logs do worker:**
```bash
pnpm --filter worker dev
```

**3. Verificar jobs agendados:**
```bash
# Conectar ao Redis
docker exec -it vip-redis redis-cli

# Listar keys
KEYS *

# Ver jobs
LRANGE bull:renewals:wait 0 -1
```

**4. Testar manualmente:**
Edite `apps/worker/src/main.ts` e adicione um job imediato para teste.

---

## 🌐 Web Admin não carrega

### Problema
Página em branco ou erro 404.

### Soluções

**1. Verificar se está rodando:**
```bash
pnpm --filter web-admin dev
```

**2. Verificar porta:**
```
http://localhost:3001
```

**3. Limpar cache do Next.js:**
```bash
cd apps/web-admin
rm -rf .next
pnpm dev
cd ../..
```

---

## 📦 Erro ao instalar dependências

### Problema
`pnpm install` falha.

### Soluções

**1. Limpar cache:**
```bash
pnpm store prune
pnpm install
```

**2. Deletar lock file:**
```bash
rm pnpm-lock.yaml
pnpm install
```

**3. Verificar versão do Node:**
```bash
node --version
# Deve ser 18 ou superior
```

**4. Reinstalar pnpm:**
```bash
npm uninstall -g pnpm
npm install -g pnpm@latest
```

---

## 🔐 Erro de permissão (Linux/Mac)

### Problema
`Permission denied` ao executar scripts.

### Solução
```bash
# Dar permissão de execução
chmod +x setup.sh
chmod +x infra/scripts/*.sh

# Executar
./setup.sh
```

---

## 💾 Banco de dados não conecta

### Problema
`Can't reach database server` ou similar.

### Checklist

**1. Verificar se PostgreSQL está rodando:**
```bash
docker ps | grep postgres
```

**2. Verificar DATABASE_URL:**
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vip_system
```

**3. Testar conexão:**
```bash
cd apps/api
pnpm prisma db push
```

**4. Reiniciar container:**
```bash
docker-compose restart postgres
```

**5. Ver logs do PostgreSQL:**
```bash
docker-compose logs postgres
```

---

## 🚀 Erro ao fazer deploy

### Problema
Aplicação não inicia em produção.

### Checklist

**1. Build antes de deploy:**
```bash
pnpm build
```

**2. Verificar variáveis de ambiente:**
Todas as variáveis do `.env.example` devem estar configuradas.

**3. Rodar migrations:**
```bash
cd apps/api
pnpm prisma migrate deploy
```

**4. Verificar NODE_ENV:**
```env
NODE_ENV=production
```

---

## 📞 Ainda com problemas?

### Verificações Gerais

**1. Versões:**
```bash
node --version   # >= 18
pnpm --version   # >= 8
docker --version # >= 20
```

**2. Logs completos:**
```bash
# API
pnpm --filter api dev 2>&1 | tee api.log

# Bot
pnpm --filter bot dev 2>&1 | tee bot.log

# Worker
pnpm --filter worker dev 2>&1 | tee worker.log
```

**3. Validar TypeScript:**
```bash
pnpm --filter api exec tsc --noEmit
pnpm --filter bot exec tsc --noEmit
pnpm --filter worker exec tsc --noEmit
```

**4. Limpar tudo e recomeçar:**
```bash
# Parar tudo
docker-compose down -v

# Limpar
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm -rf apps/*/dist packages/*/dist
rm -rf apps/web-admin/.next

# Reinstalar
pnpm install

# Reconfigurar
./setup.sh  # ou setup.bat no Windows
```

---

## 💡 Dicas de Debug

### Habilitar logs detalhados

**API:**
```typescript
// apps/api/src/config/logger.ts
level: 'debug'  // em vez de 'info'
```

**Bot:**
```typescript
// apps/bot/src/bot.ts
bot.use((ctx, next) => {
  console.log('Update:', JSON.stringify(ctx.update, null, 2));
  return next();
});
```

**Worker:**
```typescript
// apps/worker/src/main.ts
worker.on('active', (job) => {
  console.log(`Job ${job.id} started`);
});
```

### Usar debugger

**VS Code launch.json:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug API",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["--filter", "api", "dev"],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

---

## ✅ Checklist de Funcionamento

Use este checklist para verificar se tudo está funcionando:

- [ ] `pnpm install` executado com sucesso
- [ ] Docker containers rodando (`docker ps`)
- [ ] `.env` configurado com credenciais reais
- [ ] Prisma Client gerado (`pnpm prisma generate`)
- [ ] Migrations aplicadas (`pnpm prisma migrate dev`)
- [ ] API responde em http://localhost:3000/health
- [ ] Bot responde ao `/start` no Telegram
- [ ] Worker mostra logs de jobs agendados
- [ ] Web Admin carrega em http://localhost:3001
- [ ] Sem erros vermelhos no VS Code

Se todos os itens estiverem ✅, o sistema está funcionando perfeitamente!
