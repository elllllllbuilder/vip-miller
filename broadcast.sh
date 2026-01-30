#!/bin/bash

# Script para enviar broadcast via API

API_URL="https://vip-system-api.onrender.com"

echo "📢 Sistema de Broadcast"
echo ""
echo "Escolha o público-alvo:"
echo "1) Todos os usuários"
echo "2) Apenas VIPs"
echo "3) Apenas não-VIPs"
echo "4) Apenas expirados"
echo ""
read -p "Opção: " option

case $option in
  1) TARGET="all" ;;
  2) TARGET="vip" ;;
  3) TARGET="non-vip" ;;
  4) TARGET="expired" ;;
  *) echo "Opção inválida"; exit 1 ;;
esac

echo ""
echo "Digite a mensagem (pressione Enter duas vezes para finalizar):"
MESSAGE=""
while IFS= read -r line; do
  [ -z "$line" ] && break
  MESSAGE="${MESSAGE}${line}\n"
done

echo ""
read -p "Adicionar botão? (s/n): " add_button

if [ "$add_button" = "s" ]; then
  read -p "Texto do botão: " button_text
  read -p "Callback data: " button_callback
  
  curl -X POST "${API_URL}/broadcast/send" \
    -H "Content-Type: application/json" \
    -d "{
      \"message\": \"${MESSAGE}\",
      \"target\": \"${TARGET}\",
      \"button\": {
        \"text\": \"${button_text}\",
        \"callback_data\": \"${button_callback}\"
      }
    }"
else
  curl -X POST "${API_URL}/broadcast/send" \
    -H "Content-Type: application/json" \
    -d "{
      \"message\": \"${MESSAGE}\",
      \"target\": \"${TARGET}\"
    }"
fi

echo ""
echo "✅ Broadcast enviado!"
