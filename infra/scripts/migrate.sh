#!/bin/bash

# Script para rodar migrations em produção
echo "📦 Running database migrations..."

cd apps/api
pnpm prisma migrate deploy
pnpm prisma generate

echo "✅ Migrations completed!"
