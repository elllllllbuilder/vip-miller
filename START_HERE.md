# 🚀 COMECE AQUI!

## ⚠️ IMPORTANTE: Erros Vermelhos são Normais!

Se você está vendo erros vermelhos no VS Code (como em `env.ts`), **não se preocupe!** Isso é completamente normal antes de instalar as dependências.

## 🎯 3 Passos para Começar

### 1️⃣ Instalar Dependências (2-5 min)

```bash
pnpm install
```

**Isso vai:**
- Instalar todas as dependências
- Resolver os erros vermelhos do TypeScript
- Preparar o projeto para rodar

### 2️⃣ Configurar Credenciais (5-10 min)

Edite o arquivo `.env` (já existe!) com suas credenciais:

```env
# Obtenha com @BotFather no Telegram
TELEGRAM_BOT_TOKEN=seu_token_aqui

# ID do grupo VIP (número negativo)
TELEGRAM_VIP_CHAT_ID=-1001234567890

# Credenciais da SyncPay
SYNCPAY_API_KEY=sua_chave_aqui
SYNCPAY_WEBHOOK_SECRET=seu_secret_aqui
```

**Como obter o TELEGRAM_VIP_CHAT_ID:**
1. Adicione o bot ao grupo
2. Envie uma mensagem no grupo
3. Acesse: `https://api.telegram.org/bot<TOKEN>/getUpdates`
4. Procure por `"chat":{"id":-1001234567890}`

### 3️⃣ Rodar Setup Automático (5 min)

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Ou manualmente:**
```bash
# Iniciar Docker
docker-compose up -d

# Gerar Prisma
cd apps/api
pnpm prisma generate
pnpm prisma migrate dev
cd ../..

# Iniciar tudo
pnpm dev
```

## ✅ Pronto!

Agora você tem:
- ✅ API rodando em http://localhost:3000
- ✅ Bot Telegram funcionando
- ✅ Worker de renovações ativo
- ✅ Web Admin em http://localhost:3001

## 🧪 Testar

1. **Bot:** Envie `/start` para seu bot no Telegram
2. **API:** Acesse http://localhost:3000/health
3. **Admin:** Acesse http://localhost:3001 (senha: admin123)

## 📚 Documentação

- **Problemas?** → Leia `TROUBLESHOOTING.md`
- **Comandos?** → Leia `COMMANDS.md`
- **Setup detalhado?** → Leia `SETUP.md`
- **Arquitetura?** → Leia `docs/architecture.md`

## 🆘 Ajuda Rápida

### Erros vermelhos no VS Code?
```bash
pnpm install
# Depois: Ctrl+Shift+P → "Reload Window"
```

### Docker não inicia?
```bash
# Verifique se Docker Desktop está rodando
docker ps
```

### Bot não responde?
```bash
# Verifique o token no .env
# Veja os logs:
pnpm --filter bot dev
```

### Banco não conecta?
```bash
# Reinicie o PostgreSQL
docker-compose restart postgres
```

## 🎯 Estrutura Rápida

```
vip-system/
├── apps/
│   ├── api/          ← API REST
│   ├── bot/          ← Bot Telegram
│   ├── worker/       ← Renovações
│   └── web-admin/    ← Painel Admin
├── packages/         ← Código compartilhado
├── docs/             ← Documentação
└── .env              ← Suas credenciais
```

## 💡 Dica

Execute os comandos na ordem:
1. `pnpm install` (primeiro!)
2. Editar `.env`
3. `docker-compose up -d`
4. `setup.bat` ou `setup.sh`
5. `pnpm dev`

## 🎉 É isso!

Projeto completo e funcionando em menos de 30 minutos!

**Dúvidas?** Consulte os arquivos de documentação na raiz do projeto.
