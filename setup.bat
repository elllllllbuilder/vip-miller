@echo off
echo ========================================
echo VIP System - Setup Inicial
echo ========================================
echo.

echo [1/6] Instalando dependencias...
call pnpm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias
    pause
    exit /b 1
)
echo.

echo [2/6] Verificando Docker...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo AVISO: Docker nao esta rodando. Inicie o Docker Desktop.
    pause
)
echo.

echo [3/6] Iniciando containers Docker...
docker-compose up -d
echo.

echo [4/6] Aguardando containers iniciarem...
timeout /t 5 /nobreak >nul
echo.

echo [5/6] Gerando Prisma Client...
cd apps\api
call pnpm prisma generate
if %errorlevel% neq 0 (
    echo ERRO: Falha ao gerar Prisma Client
    cd ..\..
    pause
    exit /b 1
)
echo.

echo [6/6] Rodando migrations...
call pnpm prisma migrate dev --name init
cd ..\..
echo.

echo ========================================
echo Setup concluido com sucesso!
echo ========================================
echo.
echo Proximos passos:
echo 1. Edite o arquivo .env com suas credenciais
echo 2. Execute: pnpm dev
echo.
pause
