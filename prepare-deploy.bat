@echo off
echo ========================================
echo Preparando projeto para deploy no Render
echo ========================================
echo.

echo [1/5] Building aplicacoes...
call npx pnpm build
if %errorlevel% neq 0 (
    echo ERRO no build
    pause
    exit /b 1
)
echo Build concluido
echo.

echo [2/5] Verificando TypeScript...
call npx pnpm --filter api exec tsc --noEmit
call npx pnpm --filter bot exec tsc --noEmit
call npx pnpm --filter worker exec tsc --noEmit
echo TypeScript verificado
echo.

echo [3/5] Verificando Prisma...
cd apps\api
call npx prisma validate
call npx prisma format
cd ..\..
echo Prisma verificado
echo.

echo [4/5] Fazendo commit...
git add .
git commit -m "Deploy: Preparado para Render"
echo Commit realizado
echo.

echo [5/5] Fazendo push para GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERRO no push. Verifique suas credenciais do GitHub
    pause
    exit /b 1
)
echo Push concluido
echo.

echo ==========================================
echo Projeto pronto para deploy!
echo ==========================================
echo.
echo Proximos passos:
echo 1. Acesse: https://dashboard.render.com
echo 2. Clique em 'New +' -^> 'Blueprint'
echo 3. Conecte o repositorio: elllllllbuilder/vip-miller
echo 4. Render vai detectar o render.yaml automaticamente
echo 5. Clique em 'Apply' para fazer deploy
echo.
echo Ou siga o guia completo em: DEPLOY_RENDER.md
echo.
pause
