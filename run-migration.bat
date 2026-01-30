@echo off

echo Rodando migration de follow-up...

cd apps\api

REM Rodar migration
call pnpm prisma migrate deploy

echo.
echo Migration concluida!
echo.
echo Verificando status das migrations:
call pnpm prisma migrate status

pause
