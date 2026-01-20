#!/bin/bash

# Script para desenvolvimento local
echo "🚀 Starting VIP System in development mode..."

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "✅ Please edit .env with your credentials before continuing."
    exit 1
fi

# Iniciar docker-compose
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Aguardar containers iniciarem
echo "⏳ Waiting for containers to be ready..."
sleep 5

# Rodar migrations
echo "📦 Running database migrations..."
cd apps/api
pnpm prisma migrate dev
cd ../..

# Iniciar aplicações
echo "🎯 Starting applications..."
pnpm dev
