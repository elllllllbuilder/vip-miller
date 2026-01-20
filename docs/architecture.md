# Arquitetura do Sistema VIP

## Visão Geral

O sistema VIP é um monorepo composto por 4 aplicações principais e 3 pacotes compartilhados.

## Aplicações

### 1. API (apps/api)
- **Framework**: Fastify
- **Banco de dados**: PostgreSQL via Prisma
- **Responsabilidades**:
  - Gerenciar usuários, assinaturas e pagamentos
  - Processar webhooks do SyncPay
  - Integrar com Telegram API para criar links de convite
  - Fornecer endpoints para bot e admin

### 2. Bot (apps/bot)
- **Framework**: grammY
- **Responsabilidades**:
  - Receber comando /start
  - Verificar se usuário está no grupo VIP
  - Enviar sequências de mensagens (VIP ou vendas)
  - Gerar pagamentos Pix via API
  - Gerenciar estado do funil de vendas

### 3. Worker (apps/worker)
- **Framework**: BullMQ + Redis
- **Responsabilidades**:
  - Enviar lembretes de renovação (D-7, D-3, D-1)
  - Processar assinaturas expiradas
  - Remover usuários do grupo VIP quando expirar
  - Jobs agendados via cron

### 4. Web Admin (apps/web-admin)
- **Framework**: Next.js 14
- **Responsabilidades**:
  - Dashboard administrativo
  - Visualizar usuários, pagamentos e assinaturas
  - Gerenciar campanhas e funis
  - Autenticação simples (mock)

## Pacotes Compartilhados

### 1. @vip-system/shared
- Tipos TypeScript compartilhados
- Constantes (planos, funis)
- Utilitários (money, assert)

### 2. @vip-system/sdk-telegram
- Cliente HTTP para Telegram API
- Métodos: getChatMember, createChatInviteLink, sendMessage, ban/unban

### 3. @vip-system/sdk-syncpay
- Cliente HTTP para SyncPay API
- Validação de assinatura de webhooks
- Criação de cobranças Pix

## Fluxo de Dados

### Fluxo de Assinatura

1. Usuário envia /start ao bot
2. Bot verifica se está no grupo VIP (getChatMember)
3. Se não VIP: envia sequência de vendas
4. Usuário clica "Assinar"
5. Bot chama API → API chama SyncPay → retorna Pix
6. Bot envia código Pix ao usuário
7. Usuário paga
8. SyncPay envia webhook para API
9. API valida assinatura, cria/renova subscription
10. API gera link de convite (24h, 1 uso)
11. API envia link ao usuário via Telegram

### Fluxo de Renovação

1. Worker roda diariamente (cron)
2. Busca subscriptions expirando em 7, 3, 1 dias
3. Envia mensagens de lembrete via Telegram
4. No dia da expiração (D0):
   - Marca subscription como expired
   - Remove usuário do grupo (opcional)
   - Envia mensagem de expiração

## Banco de Dados

### Tabelas Principais

- **users**: Dados dos usuários Telegram
- **subscriptions**: Assinaturas ativas/expiradas
- **payments**: Histórico de pagamentos
- **user_state**: Estado do funil de vendas
- **invite_links**: Links de convite gerados
- **message_log**: Log de mensagens enviadas

## Segurança

- Webhooks validam assinatura HMAC SHA256
- Idempotência via provider_charge_id único
- Rate limiting no bot
- Validação de schemas com Zod

## Escalabilidade

- API stateless (pode escalar horizontalmente)
- Worker usa Redis para jobs distribuídos
- Bot pode usar webhooks em vez de polling
- Banco de dados com índices otimizados
