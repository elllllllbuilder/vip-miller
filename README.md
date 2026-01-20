# VIP System - Sistema de Assinaturas com Telegram

Sistema completo de gerenciamento de assinaturas VIP com bot Telegram, pagamentos via Pix (SyncPay) e renovação automática.

## Arquitetura

- **apps/api**: API REST (Fastify + Prisma)
- **apps/bot**: Bot Telegram (grammY)
- **apps/worker**: Worker de renovações (BullMQ)
- **apps/web-admin**: Painel administrativo (Next.js)
- **packages/shared**: Tipos e constantes compartilhadas
- **packages/sdk-telegram**: SDK customizado Telegram
- **packages/sdk-syncpay**: SDK customizado SyncPay

## Setup Inicial

### ⚡ Setup Automático (Recomendado)

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### 🔧 Setup Manual

### 1. Instalar dependências

```bash
pnpm install
```

**Nota:** Os erros de TypeScript no VS Code são normais antes de instalar as dependências!

### 2. Configurar variáveis de ambiente

O arquivo `.env` já está criado com valores padrão. Edite-o com suas credenciais reais:

```bash
# Edite o arquivo .env
```

### 3. Obter TELEGRAM_VIP_CHAT_ID

1. Adicione o bot ao grupo VIP
2. Envie uma mensagem no grupo
3. Acesse: `https://api.telegram.org/bot<TOKEN>/getUpdates`
4. Procure por `"chat":{"id":-1001234567890}` (número negativo)
5. Use esse ID no `.env`

### 4. Configurar Bot como Admin

O bot precisa ser **administrador** do grupo VIP com as seguintes permissões:
- ✅ Convidar usuários via link
- ✅ Banir usuários (para remover expirados)

### 5. Iniciar infraestrutura

```bash
docker-compose up -d
```

### 6. Rodar migrations

```bash
pnpm migrate:dev
```

### 7. Iniciar aplicações

```bash
pnpm dev
```

Isso iniciará:
- API em http://localhost:3000
- Bot Telegram
- Worker de renovações

### 8. Web Admin (opcional)

```bash
cd apps/web-admin
pnpm dev
```

Acesse http://localhost:3001

## Fluxo de Funcionamento

### 1. Usuário envia /start

- Bot verifica se usuário está no grupo VIP
- **VIP**: Envia sequência de boas-vindas VIP
- **Não-VIP**: Envia sequência de vendas (primeira vez ou retorno)

### 2. Checkout Pix

- Usuário clica em "Assinar"
- Bot chama API → SyncPay gera Pix
- Usuário recebe código Pix para copiar

### 3. Confirmação de Pagamento

- SyncPay envia webhook para API
- API valida assinatura e cria/renova subscription
- API gera link de convite único (24h, 1 uso)
- Bot envia link ao usuário

### 4. Renovação Automática

Worker verifica diariamente:
- **D-7**: Lembrete de renovação
- **D-3**: Segundo lembrete
- **D-1**: Último aviso
- **D0**: Marca como expirado e remove do grupo

## Scripts Úteis

```bash
# Desenvolvimento
pnpm dev

# Build produção
pnpm build

# Migrations
pnpm migrate:dev    # desenvolvimento
pnpm migrate        # produção

# Rodar apenas um app
pnpm --filter api dev
pnpm --filter bot dev
pnpm --filter worker dev
```

## Estrutura do Banco

- **users**: Dados dos usuários Telegram
- **subscriptions**: Assinaturas ativas/expiradas
- **payments**: Histórico de pagamentos
- **invite_links**: Links de convite gerados
- **user_state**: Estado do funil de vendas
- **message_log**: Log de mensagens enviadas

## Variáveis de Ambiente Importantes

| Variável | Descrição |
|----------|-----------|
| `TELEGRAM_BOT_TOKEN` | Token do BotFather |
| `TELEGRAM_VIP_CHAT_ID` | ID do grupo VIP (número negativo) |
| `SYNCPAY_API_KEY` | Chave API SyncPay |
| `SYNCPAY_WEBHOOK_SECRET` | Secret para validar webhooks |
| `DATABASE_URL` | Connection string PostgreSQL |
| `REDIS_URL` | Connection string Redis |

## Segurança

- Webhooks validam assinatura HMAC SHA256
- Idempotência via `provider_charge_id` único
- Rate limiting no bot
- Validação de schemas com Zod

## Suporte

Para dúvidas sobre:
- **SyncPay**: https://docs.syncpay.com.br
- **Telegram Bot API**: https://core.telegram.org/bots/api
- **grammY**: https://grammy.dev
