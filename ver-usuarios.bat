@echo off
echo.
echo ========================================
echo   VER USUARIOS DO BOT
echo ========================================
echo.
echo Escolha uma opcao:
echo.
echo 1 - Todos os usuarios
echo 2 - Apenas VIPs
echo 3 - Apenas nao-VIPs
echo 4 - Apenas expirados
echo.
set /p opcao="Digite o numero: "

if "%opcao%"=="1" (
    echo.
    echo Buscando todos os usuarios...
    curl https://vip-system-api.onrender.com/broadcast/users/all
)

if "%opcao%"=="2" (
    echo.
    echo Buscando usuarios VIP...
    curl https://vip-system-api.onrender.com/broadcast/users/vip
)

if "%opcao%"=="3" (
    echo.
    echo Buscando usuarios nao-VIP...
    curl https://vip-system-api.onrender.com/broadcast/users/non-vip
)

if "%opcao%"=="4" (
    echo.
    echo Buscando usuarios expirados...
    curl https://vip-system-api.onrender.com/broadcast/users/expired
)

echo.
echo.
pause
