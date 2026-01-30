# 🔄 Como Rodar Migrations no Render

## Opção 1: Via Shell do Render (Mais Fácil)

### 1. Acesse o Shell da API
1. Vá para https://dashboard.render.com
2. Click no serviço **vip-system-api** (ou vip-miller-api)
3. Click na aba **"Shell"** no menu superior
4. Aguarde o shell carregar

### 2. Rode a Migration
```bash
cd apps/api
pnpm prisma migrate deploy
```

Pronto! A migration será aplicada no banco de produção.

## Opção 2: Via Deploy Automático (Recomendado)

A migration já roda automaticamente no deploy da API porque o `Start Command` tem:

```bash
pnpm prisma migrate deploy && pnpm start
```

Então basta fazer:
```bash
git add .
git commit -m "fix: corrige tipos do worker"
git push
```

O Render vai:
1. Fazer deploy da API
2. Rodar as migrations automaticamente
3. Iniciar a API

## Opção 3: Localmente (Se tiver acesso ao banco)

Se você tem a `DATABASE_URL` do Render:

```bash
# No seu computador
cd apps/api
DATABASE_URL="postgresql://vip_postgres_user:CI6Ljk1nTWPVuDsSkpMOfEqLf2bnXkGL@dpg-d5nq52coud1c73a4r15g-a.oregon-postgres.render.com/vip_postgres" pnpm prisma migrate deploy
```

## ✅ Verificar se a Migration Rodou

### Via Shell do Render:
```bash
cd apps/api
pnpm prisma migrate status
```

### Via SQL (no Shell):
```bash
psql $DATABASE_URL -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'user_states';"
```

Deve mostrar as novas colunas:
- `last_offer_shown_at`
- `followup_count`
- `last_followup_sent_at`

## 🐛 Troubleshooting

### "Migration already applied"
✅ Tudo certo! A migration já foi aplicada.

### "Connection refused"
❌ Verifique se a `DATABASE_URL` está correta nas variáveis de ambiente.

### "Permission denied"
❌ O usuário do banco precisa ter permissão para criar colunas.

## 📋 Migrations Pendentes

Para ver quais migrations ainda não foram aplicadas:

```bash
cd apps/api
pnpm prisma migrate status
```

## 🔄 Rollback (Reverter Migration)

⚠️ **Cuidado!** Isso pode causar perda de dados.

```bash
# Não há rollback automático no Prisma
# Você precisa criar uma nova migration que reverte as mudanças

cd apps/api
pnpm prisma migrate dev --name revert_followup
```

Depois edite o arquivo SQL gerado para remover as colunas:

```sql
ALTER TABLE "user_states" DROP COLUMN "last_offer_shown_at";
ALTER TABLE "user_states" DROP COLUMN "followup_count";
ALTER TABLE "user_states" DROP COLUMN "last_followup_sent_at";
```

## 🚀 Próximos Passos

Após rodar a migration:

1. ✅ Commit e push do código corrigido
2. ✅ Deploy do Worker (vai funcionar agora)
3. ✅ Testar o sistema de follow-up
