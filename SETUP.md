# Guia de Setup Rápido - VIP System

## Pré-requisitos

- Node.js 18+ instalado
- pnpm instalado (`npm install -g pnpm`)
- Docker e Docker Compose instalados
- Conta no Telegram com bot criado (via @BotFather)
- Conta na SyncPay (ou similar para pagamentos Pix)

## Passo a Passo

### 1. Instalar Dependências

```bash
pnpm install
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vip_system

# Redis
REDIS_URL=redis://localhost:6379

# API
API_PORT=3000
API_URL=http://localhost:3000

# Telegram Bot
TELEGRAM_BOT_TOKEN=seu_token_aqui
TELEGRAM_VIP_CHAT_ID=-1001234567890

# SyncPay
SYNCPAY_API_KEY=sua_chave_aqui
SYNCPAY_WEBHOOK_SECRET=seu_secret_aqui
```

### 3. Obter TELEGRAM_VIP_CHAT_ID

1. Crie um grupo no Telegram
2. Adicione o bot ao grupo
3. Envie uma mensagem qualquer no grupo
4. Acesse: `https://api.telegram.org/bot<SEU_TOKEN>/getUpdates`
5. Procure por `"chat":{"id":-1001234567890}`
6. Use esse ID (número negativo) no `.env`

### 4. Configurar Bot como Admin

No grupo VIP, adicione o bot como administrador com permissões:
- ✅ Convidar usuários via link
- ✅ Banir usuários

### 5. Iniciar Infraestrutura

```bash
docker-compose up -d
```

Isso iniciará PostgreSQL e Redis.

### 6. Rodar Migrations

```bash
cd apps/api
pnpm prisma generate
pnpm prisma migrate dev
cd ../..
```

### 7. Iniciar Aplicações

```bash
pnpm dev
```

Isso iniciará:
- API em http://localhost:3000
- Bot Telegram
- Worker de renovações

### 8. Testar o Bot

1. Abra o Telegram
2. Procure seu bot
3. Envie `/start`
4. Você deve receber a sequência de mensagens

### 9. Web Admin (Opcional)

Em outro terminal:

```bash
cd apps/web-admin
pnpm dev
```

Acesse http://localhost:3001
- Login: qualquer usuário
- Senha: `admin123`

## Estrutura de Pastas

```
vip-system/
├── apps/
│   ├── api/          # API REST (Fastify)
│   ├── bot/          # Bot Telegram (grammY)
│   ├── worker/       # Worker de renovações (BullMQ)
│   └── web-admin/    # Painel admin (Next.js)
├── packages/
│   ├── shared/       # Tipos e constantes
│   ├── sdk-telegram/ # SDK Telegram
│   └── sdk-syncpay/  # SDK SyncPay
├── docs/             # Documentação
└── infra/            # Scripts e configs
```

## Comandos Úteis

```bash
# Desenvolvimento
pnpm dev                    # Inicia api + bot + worker

# Build
pnpm build                  # Build de todos os apps

# Migrations
pnpm --filter api migrate:dev    # Desenvolvimento
pnpm --filter api migrate        # Produção

# Rodar apenas um app
pnpm --filter api dev
pnpm --filter bot dev
pnpm --filter worker dev
pnpm --filter web-admin dev
```

## Testando Pagamentos

### Modo de Teste (sem SyncPay real)

1. Comente a chamada real ao SyncPay em `apps/api/src/modules/payments/payments.service.ts`
2. Retorne dados mockados
3. Chame o webhook manualmente:

```bash
curl -X POST http://localhost:3000/webhooks/syncpay \
  -H "Content-Type: application/json" \
  -H "X-SyncPay-Signature: test" \
  -d '{
    "event": "charge.paid",
    "charge_id": "test_123",
    "status": "paid",
    "paid_at": "2024-01-20T10:00:00Z"
  }'
```

## Troubleshooting

### Bot não responde
- Verifique se TELEGRAM_BOT_TOKEN está correto
- Verifique logs do bot: `pnpm --filter bot dev`

### Erro de conexão com banco
- Verifique se Docker está rodando: `docker ps`
- Verifique DATABASE_URL no .env

### Webhook não funciona
- Verifique SYNCPAY_WEBHOOK_SECRET
- Verifique logs da API
- Em produção, use ngrok para testar localmente

### Worker não envia mensagens
- Verifique se Redis está rodando
- Verifique logs do worker
- Verifique se há subscriptions expirando

## Próximos Passos

1. Personalize as mensagens em `apps/bot/src/ui/messages/`
2. Configure webhook da SyncPay para apontar para sua API
3. Ajuste valores e planos em `.env`
4. Implemente autenticação real no web-admin
5. Configure monitoramento e logs em produção

## Suporte

- Documentação da API: `docs/api.md`
- Arquitetura: `docs/architecture.md`
- Funis: `docs/funnels.md`
