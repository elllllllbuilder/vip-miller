@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   ENVIAR BROADCAST
echo ========================================
echo.
echo Escolha o publico:
echo.
echo 1 - Todos os usuarios
echo 2 - Apenas VIPs
echo 3 - Apenas nao-VIPs
echo 4 - Apenas expirados
echo.
set /p publico="Digite o numero: "

if "%publico%"=="1" set target=all
if "%publico%"=="2" set target=vip
if "%publico%"=="3" set target=non-vip
if "%publico%"=="4" set target=expired

echo.
echo Digite a mensagem (uma linha):
set /p mensagem=""

echo.
set /p botao="Adicionar botao? (s/n): "

if /i "%botao%"=="s" (
    echo.
    echo Enviando com botao "Assinar VIP"...
    curl -X POST https://vip-system-api.onrender.com/broadcast/send -H "Content-Type: application/json" -d "{\"message\":\"%mensagem%\",\"target\":\"%target%\",\"button\":{\"text\":\"💎 Assinar VIP\",\"callback_data\":\"subscribe_monthly\"}}"
) else (
    echo.
    echo Enviando mensagem simples...
    curl -X POST https://vip-system-api.onrender.com/broadcast/send -H "Content-Type: application/json" -d "{\"message\":\"%mensagem%\",\"target\":\"%target%\"}"
)

echo.
echo.
echo ========================================
echo   BROADCAST ENVIADO!
echo ========================================
echo.
pause
