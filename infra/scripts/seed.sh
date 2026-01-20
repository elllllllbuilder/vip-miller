#!/bin/bash

# Script para popular banco com dados de teste
echo "🌱 Seeding database..."

cd apps/api

# Criar usuário de teste
echo "Creating test user..."

# Em produção, criar script de seed real com Prisma
# npx prisma db seed

echo "✅ Seeding completed!"
