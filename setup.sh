#!/bin/bash

echo "========================================"
echo "VIP System - Setup Inicial"
echo "========================================"
echo ""

echo "[1/6] Instalando dependências..."
pnpm install
if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao instalar dependências"
    exit 1
fi
echo ""

echo "[2/6] Verificando Docker..."
if ! docker ps > /dev/null 2>&1; then
    echo "AVISO: Docker não está rodando. Inicie o Docker."
    read -p "Pressione Enter para continuar..."
fi
echo ""

echo "[3/6] Iniciando containers Docker..."
docker-compose up -d
echo ""

echo "[4/6] Aguardando containers iniciarem..."
sleep 5
echo ""

echo "[5/6] Gerando Prisma Client..."
cd apps/api
pnpm prisma generate
if [ $? -ne 0 ]; then
    echo "ERRO: Falha ao gerar Prisma Client"
    cd ../..
    exit 1
fi
echo ""

echo "[6/6] Rodando migrations..."
pnpm prisma migrate dev --name init
cd ../..
echo ""

echo "========================================"
echo "Setup concluído com sucesso!"
echo "========================================"
echo ""
echo "Próximos passos:"
echo "1. Edite o arquivo .env com suas credenciais"
echo "2. Execute: pnpm dev"
echo ""
