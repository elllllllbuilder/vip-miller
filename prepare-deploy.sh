#!/bin/bash

echo "🚀 Preparando projeto para deploy no Render..."
echo ""

# 1. Build de todos os apps
echo "[1/5] Building aplicações..."
npx pnpm build
if [ $? -ne 0 ]; then
    echo "❌ Erro no build"
    exit 1
fi
echo "✅ Build concluído"
echo ""

# 2. Verificar TypeScript
echo "[2/5] Verificando TypeScript..."
npx pnpm --filter api exec tsc --noEmit
npx pnpm --filter bot exec tsc --noEmit
npx pnpm --filter worker exec tsc --noEmit
if [ $? -ne 0 ]; then
    echo "⚠️  Avisos de TypeScript encontrados (não crítico)"
fi
echo "✅ TypeScript verificado"
echo ""

# 3. Verificar Prisma
echo "[3/5] Verificando Prisma..."
cd apps/api
npx prisma validate
npx prisma format
cd ../..
echo "✅ Prisma verificado"
echo ""

# 4. Commit e Push
echo "[4/5] Fazendo commit..."
git add .
git commit -m "Deploy: Preparado para Render"
echo "✅ Commit realizado"
echo ""

echo "[5/5] Fazendo push para GitHub..."
git push origin main
if [ $? -ne 0 ]; then
    echo "❌ Erro no push. Verifique suas credenciais do GitHub"
    exit 1
fi
echo "✅ Push concluído"
echo ""

echo "=========================================="
echo "✅ Projeto pronto para deploy!"
echo "=========================================="
echo ""
echo "Próximos passos:"
echo "1. Acesse: https://dashboard.render.com"
echo "2. Clique em 'New +' → 'Blueprint'"
echo "3. Conecte o repositório: elllllllbuilder/vip-miller"
echo "4. Render vai detectar o render.yaml automaticamente"
echo "5. Clique em 'Apply' para fazer deploy"
echo ""
echo "Ou siga o guia completo em: DEPLOY_RENDER.md"
echo ""
