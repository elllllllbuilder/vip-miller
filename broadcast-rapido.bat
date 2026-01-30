@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   BROADCAST RAPIDO
echo ========================================
echo.
echo EXEMPLOS PRONTOS:
echo.
echo 1 - Promocao para nao-VIPs
echo 2 - Novidade para VIPs
echo 3 - Reconquistar expirados
echo 4 - Aviso para todos
echo 5 - Mensagem personalizada
echo.
set /p opcao="Escolha: "

if "%opcao%"=="1" (
    echo.
    echo Enviando promocao para nao-VIPs...
    curl -X POST https://vip-system-api.onrender.com/broadcast/send -H "Content-Type: application/json" -d "{\"message\":\"🔥 PROMOÇÃO ESPECIAL!\n\nAssine o VIP agora e tenha acesso imediato a todo conteúdo exclusivo!\n\nApenas R$ 29,90/mês\n\n⏰ Não perca!\",\"target\":\"non-vip\",\"button\":{\"text\":\"💎 Quero Assinar\",\"callback_data\":\"subscribe_monthly\"}}"
)

if "%opcao%"=="2" (
    echo.
    echo Enviando novidade para VIPs...
    curl -X POST https://vip-system-api.onrender.com/broadcast/send -H "Content-Type: application/json" -d "{\"message\":\"🎉 NOVO CONTEÚDO DISPONÍVEL!\n\nAcabamos de adicionar material exclusivo no grupo.\n\nCorra para conferir! 🚀\",\"target\":\"vip\"}"
)

if "%opcao%"=="3" (
    echo.
    echo Enviando reconquista para expirados...
    curl -X POST https://vip-system-api.onrender.com/broadcast/send -H "Content-Type: application/json" -d "{\"message\":\"😢 Sentimos sua falta!\n\nVocê já foi VIP e sabemos que curtiu o conteúdo.\n\nVolte agora e veja tudo que adicionamos! 🎁\",\"target\":\"expired\",\"button\":{\"text\":\"🔄 Voltar ao VIP\",\"callback_data\":\"subscribe_monthly\"}}"
)

if "%opcao%"=="4" (
    echo.
    echo Enviando aviso para todos...
    curl -X POST https://vip-system-api.onrender.com/broadcast/send -H "Content-Type: application/json" -d "{\"message\":\"📢 COMUNICADO IMPORTANTE\n\nEstamos com novidades incríveis chegando!\n\nFique ligado! 👀\",\"target\":\"all\"}"
)

if "%opcao%"=="5" (
    goto personalizado
)

goto fim

:personalizado
echo.
echo Digite sua mensagem:
set /p msg=""
echo.
echo Enviar para: (all/vip/non-vip/expired)
set /p tgt=""
echo.
curl -X POST https://vip-system-api.onrender.com/broadcast/send -H "Content-Type: application/json" -d "{\"message\":\"%msg%\",\"target\":\"%tgt%\"}"

:fim
echo.
echo.
echo ========================================
echo   BROADCAST ENVIADO!
echo ========================================
echo.
pause
