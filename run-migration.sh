#!/bin/bash

echo "🔄 Rodando migration de follow-up..."

cd apps/api

# Rodar migration
pnpm prisma migrate deploy

echo "✅ Migration concluída!"
echo ""
echo "📊 Verificando status das migrations:"
pnpm prisma migrate status
