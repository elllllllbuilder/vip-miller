# 📢 Exemplo Prático de Broadcast

## 🎯 Cenário: Enviar promoção para não-VIPs

### 1. Ver quantos usuários não-VIP você tem

```bash
curl https://vip-system-api.onrender.com/broadcast/users/non-vip
```

**Resposta:**
```json
{
  "total": 45,
  "users": [
    {
      "telegram_user_id": "123456789",
      "username": "joao",
      "first_name": "João",
      "created_at": "2026-01-30T10:00:00.000Z"
    },
    ...
  ]
}
```

### 2. Enviar mensagem de promoção

```bash
curl -X POST https://vip-system-api.onrender.com/broadcast/send \
  -H "Content-Type: application/json" \
  -d '{
    "message": "🔥 PROMOÇÃO ESPECIAL!\n\nPor tempo limitado: Assine o VIP e ganhe acesso imediato a todo conteúdo exclusivo!\n\nApenas R$ 29,90/mês\n\n⏰ Não perca!",
    "target": "non-vip",
    "button": {
      "text": "💎 Quero Assinar Agora",
      "callback_data": "subscribe_monthly"
    }
  }'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Broadcast queued",
  "total_users": 45,
  "users": ["123456789", "987654321", ...]
}
```

### 3. O que acontece

1. ✅ API recebe a requisição
2. ✅ Busca os 45 usuários não-VIP
3. ✅ Envia a mensagem para cada um
4. ✅ Cada usuário recebe:
   - A mensagem de promoção
   - Um botão "💎 Quero Assinar Agora"
5. ✅ Quando clicam no botão → Gera Pix automaticamente!

## 📱 Como o usuário vê

```
🔥 PROMOÇÃO ESPECIAL!

Por tempo limitado: Assine o VIP e ganhe acesso 
imediato a todo conteúdo exclusivo!

Apenas R$ 29,90/mês

⏰ Não perca!

[💎 Quero Assinar Agora]
```

## 🎯 Outros Exemplos

### Avisar VIPs sobre novo conteúdo

```bash
curl -X POST https://vip-system-api.onrender.com/broadcast/send \
  -H "Content-Type: application/json" \
  -d '{
    "message": "🎉 NOVO CONTEÚDO DISPONÍVEL!\n\nAcabamos de adicionar material exclusivo sobre [TEMA].\n\nCorra para o grupo e confira! 🚀",
    "target": "vip"
  }'
```

### Reconquistar expirados

```bash
curl -X POST https://vip-system-api.onrender.com/broadcast/send \
  -H "Content-Type: application/json" \
  -d '{
    "message": "😢 Sentimos sua falta!\n\nVocê já foi VIP e sabemos que curtiu.\n\nVolte agora e veja tudo que adicionamos! 🎁",
    "target": "expired",
    "button": {
      "text": "🔄 Voltar ao VIP",
      "callback_data": "subscribe_monthly"
    }
  }'
```

### Mensagem para TODOS

```bash
curl -X POST https://vip-system-api.onrender.com/broadcast/send \
  -H "Content-Type: application/json" \
  -d '{
    "message": "📢 COMUNICADO IMPORTANTE\n\nEstamos com novidades incríveis chegando!\n\nFique ligado! 👀",
    "target": "all"
  }'
```

## 🔧 Testando Primeiro

Antes de enviar para todos, teste com você mesmo:

1. Pegue seu telegram_user_id
2. Envie só para você:

```bash
# Primeiro, veja seu ID nos logs do bot quando você envia /start
# Depois, teste a mensagem:

curl -X POST https://vip-system-api.onrender.com/broadcast/send \
  -H "Content-Type: application/json" \
  -d '{
    "message": "🧪 TESTE\n\nEsta é uma mensagem de teste.",
    "target": "all"
  }'
```

Se você for o único usuário, só você vai receber!

## ⏰ Melhores Horários

- **10h-12h**: Manhã (boa taxa de abertura)
- **14h-16h**: Tarde (moderada)
- **19h-21h**: Noite (melhor horário!)
- ❌ Evite: Madrugada, muito cedo, finais de semana

## 📊 Monitorar Resultados

Depois de enviar, veja quantos clicaram no botão:
- Acompanhe quantos Pix foram gerados
- Veja nos logs da API
- Analise conversões

## ✅ Pronto para usar!

Agora é só:
1. Fazer commit e push
2. Deploy da API
3. Testar enviando para você
4. Enviar para todos! 🚀
