# Comandos Úteis - VIP System

## Setup Inicial

```bash
# Instalar dependências
pnpm install

# Copiar .env
cp .env.example .env

# Editar .env com suas credenciais
# (use seu editor favorito)

# Iniciar Docker
docker-compose up -d

# Verificar containers
docker ps

# Gerar Prisma Client
cd apps/api
pnpm prisma generate

# Rodar migrations
pnpm prisma migrate dev

# Voltar para raiz
cd ../..
```

## Desenvolvimento

```bash
# Iniciar tudo (api + bot + worker)
pnpm dev

# Iniciar apenas API
pnpm --filter api dev

# Iniciar apenas Bot
pnpm --filter bot dev

# Iniciar apenas Worker
pnpm --filter worker dev

# Iniciar Web Admin
pnpm --filter web-admin dev
```

## Banco de Dados

```bash
# Acessar Prisma Studio (GUI do banco)
cd apps/api
pnpm prisma studio

# Criar nova migration
pnpm prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
pnpm prisma migrate deploy

# Resetar banco (CUIDADO!)
pnpm prisma migrate reset

# Ver status das migrations
pnpm prisma migrate status
```

## Docker

```bash
# Iniciar containers
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Parar e remover volumes (CUIDADO!)
docker-compose down -v

# Reiniciar apenas PostgreSQL
docker-compose restart postgres

# Reiniciar apenas Redis
docker-compose restart redis
```

## Build e Produção

```bash
# Build de todos os apps
pnpm build

# Build de um app específico
pnpm --filter api build
pnpm --filter bot build
pnpm --filter worker build
pnpm --filter web-admin build

# Rodar em produção
cd apps/api
pnpm start

cd apps/bot
pnpm start

cd apps/worker
pnpm start

cd apps/web-admin
pnpm start
```

## Testes e Debug

```bash
# Ver logs da API
pnpm --filter api dev | grep ERROR

# Testar health check
curl http://localhost:3000/health

# Testar criação de pagamento
curl -X POST http://localhost:3000/payments/pix \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_user_id": "123456789",
    "plan_id": "monthly_vip"
  }'

# Simular webhook (para testes)
curl -X POST http://localhost:3000/webhooks/syncpay \
  -H "Content-Type: application/json" \
  -H "X-SyncPay-Signature: test_signature" \
  -d '{
    "event": "charge.paid",
    "charge_id": "test_123",
    "status": "paid",
    "paid_at": "2024-01-20T10:00:00Z"
  }'
```

## Telegram

```bash
# Obter updates do bot (para pegar chat_id)
curl https://api.telegram.org/bot<SEU_TOKEN>/getUpdates

# Enviar mensagem de teste
curl -X POST https://api.telegram.org/bot<SEU_TOKEN>/sendMessage \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": 123456789,
    "text": "Teste"
  }'

# Verificar se usuário está no grupo
curl "https://api.telegram.org/bot<SEU_TOKEN>/getChatMember?chat_id=-1001234567890&user_id=123456789"
```

## Limpeza

```bash
# Limpar node_modules
pnpm clean
# ou manualmente:
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# Limpar builds
rm -rf apps/*/dist packages/*/dist apps/web-admin/.next

# Limpar tudo e reinstalar
pnpm clean
pnpm install
```

## Git

```bash
# Inicializar repositório
git init

# Adicionar todos os arquivos
git add .

# Primeiro commit
git commit -m "Initial commit: VIP System complete"

# Adicionar remote
git remote add origin <seu-repositorio>

# Push
git push -u origin main
```

## Monitoramento

```bash
# Ver uso de memória dos containers
docker stats

# Ver logs em tempo real
docker-compose logs -f api
docker-compose logs -f postgres
docker-compose logs -f redis

# Conectar ao PostgreSQL
docker exec -it vip-postgres psql -U postgres -d vip_system

# Conectar ao Redis
docker exec -it vip-redis redis-cli
```

## Troubleshooting

```bash
# Verificar portas em uso
# Windows:
netstat -ano | findstr :3000
netstat -ano | findstr :5432
netstat -ano | findstr :6379

# Matar processo em porta específica (Windows)
# Encontre o PID com netstat e:
taskkill /PID <PID> /F

# Verificar variáveis de ambiente
# Windows:
type .env

# Verificar se Prisma está sincronizado
cd apps/api
pnpm prisma validate
pnpm prisma format

# Regenerar Prisma Client
pnpm prisma generate --force
```

## Atalhos Úteis

```bash
# Alias para comandos frequentes (adicione ao seu .bashrc ou .zshrc)
alias vip-dev="pnpm dev"
alias vip-api="pnpm --filter api dev"
alias vip-bot="pnpm --filter bot dev"
alias vip-worker="pnpm --filter worker dev"
alias vip-admin="pnpm --filter web-admin dev"
alias vip-logs="docker-compose logs -f"
alias vip-db="cd apps/api && pnpm prisma studio"
```

## Comandos de Manutenção

```bash
# Atualizar dependências
pnpm update

# Verificar dependências desatualizadas
pnpm outdated

# Adicionar dependência a um app específico
pnpm --filter api add <pacote>
pnpm --filter bot add <pacote>

# Remover dependência
pnpm --filter api remove <pacote>

# Verificar vulnerabilidades
pnpm audit

# Corrigir vulnerabilidades
pnpm audit --fix
```

## Backup e Restore

```bash
# Backup do banco
docker exec vip-postgres pg_dump -U postgres vip_system > backup.sql

# Restore do banco
docker exec -i vip-postgres psql -U postgres vip_system < backup.sql

# Backup do Redis (se necessário)
docker exec vip-redis redis-cli SAVE
docker cp vip-redis:/data/dump.rdb ./redis-backup.rdb
```

## Dicas

- Use `pnpm dev` para desenvolvimento local
- Use `docker-compose logs -f` para ver logs em tempo real
- Use `pnpm prisma studio` para visualizar/editar dados
- Sempre teste webhooks localmente antes de produção
- Mantenha o `.env` seguro e nunca commite ele

## Ajuda

```bash
# Ver comandos disponíveis
pnpm run

# Ver comandos de um app específico
cd apps/api
pnpm run

# Documentação do Prisma
pnpm --filter api prisma --help

# Documentação do Docker Compose
docker-compose --help
```
