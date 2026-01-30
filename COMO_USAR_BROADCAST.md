# 🚀 Como Usar o Sistema de Broadcast

## 📋 Scripts Criados

Criei 3 scripts `.bat` para você usar direto no Windows:

### 1️⃣ `ver-usuarios.bat` - Ver quantos usuários tem

**Como usar:**
1. Dê duplo clique no arquivo `ver-usuarios.bat`
2. Escolha uma opção:
   - `1` - Todos os usuários
   - `2` - Apenas VIPs
   - `3` - Apenas não-VIPs
   - `4` - Apenas expirados
3. Veja o resultado!

**Exemplo:**
```
========================================
  VER USUARIOS DO BOT
========================================

Escolha uma opcao:

1 - Todos os usuarios
2 - Apenas VIPs
3 - Apenas nao-VIPs
4 - Apenas expirados

Digite o numero: 1

Buscando todos os usuarios...
{"total":15,"users":[...]}
```

---

### 2️⃣ `enviar-broadcast.bat` - Enviar mensagem personalizada

**Como usar:**
1. Dê duplo clique no arquivo `enviar-broadcast.bat`
2. Escolha o público (1-4)
3. Digite sua mensagem
4. Escolha se quer botão (s/n)
5. Pronto! Mensagem enviada!

**Exemplo:**
```
========================================
  ENVIAR BROADCAST
========================================

Escolha o publico:

1 - Todos os usuarios
2 - Apenas VIPs
3 - Apenas nao-VIPs
4 - Apenas expirados

Digite o numero: 3

Digite a mensagem (uma linha):
🔥 Promoção especial! Assine agora!

Adicionar botao? (s/n): s

Enviando com botao "Assinar VIP"...
{"success":true,"total_users":10}

========================================
  BROADCAST ENVIADO!
========================================
```

---

### 3️⃣ `broadcast-rapido.bat` - Mensagens prontas ⭐ Mais Fácil!

**Como usar:**
1. Dê duplo clique no arquivo `broadcast-rapido.bat`
2. Escolha uma mensagem pronta:
   - `1` - Promoção para não-VIPs
   - `2` - Novidade para VIPs
   - `3` - Reconquistar expirados
   - `4` - Aviso para todos
   - `5` - Mensagem personalizada
3. Pronto! Enviado automaticamente!

**Exemplo:**
```
========================================
  BROADCAST RAPIDO
========================================

EXEMPLOS PRONTOS:

1 - Promocao para nao-VIPs
2 - Novidade para VIPs
3 - Reconquistar expirados
4 - Aviso para todos
5 - Mensagem personalizada

Escolha: 1

Enviando promocao para nao-VIPs...
{"success":true,"total_users":10}

========================================
  BROADCAST ENVIADO!
========================================
```

---

## 🎯 Fluxo Recomendado

### Primeira vez:
1. Execute `ver-usuarios.bat` → Opção `1` (ver todos)
2. Veja quantos usuários você tem
3. Execute `broadcast-rapido.bat` → Opção `4` (aviso para todos)
4. Teste se você recebeu a mensagem no Telegram!

### Para enviar promoção:
1. Execute `ver-usuarios.bat` → Opção `3` (não-VIPs)
2. Veja quantos não-VIPs você tem
3. Execute `broadcast-rapido.bat` → Opção `1` (promoção)
4. Pronto! Todos não-VIPs recebem!

### Para avisar VIPs:
1. Execute `ver-usuarios.bat` → Opção `2` (VIPs)
2. Execute `broadcast-rapido.bat` → Opção `2` (novidade)
3. Todos VIPs recebem!

---

## ⚠️ Importante

### Antes de usar:
1. ✅ Faça commit e push do código
2. ✅ Deploy da API no Render
3. ✅ Aguarde a API estar online
4. ✅ Teste enviando para você primeiro!

### Para testar:
1. Execute `ver-usuarios.bat` → Veja se você aparece na lista
2. Execute `broadcast-rapido.bat` → Opção `4` (aviso para todos)
3. Verifique se você recebeu no Telegram
4. Se funcionou, pode enviar para todos! 🎉

---

## 🐛 Troubleshooting

### "curl não é reconhecido"
Você precisa instalar o curl no Windows:
1. Baixe: https://curl.se/windows/
2. Ou use o PowerShell (já tem curl)

### "Não recebi a mensagem"
1. Verifique se a API está online: https://vip-system-api.onrender.com
2. Verifique se você já deu `/start` no bot
3. Veja os logs da API no Render

### "Erro 404"
A API ainda não fez deploy. Aguarde o deploy terminar.

### "Erro 500"
Veja os logs da API no Render para identificar o problema.

---

## 📊 Mensagens Prontas

### Opção 1 - Promoção para não-VIPs:
```
🔥 PROMOÇÃO ESPECIAL!

Assine o VIP agora e tenha acesso imediato a todo conteúdo exclusivo!

Apenas R$ 29,90/mês

⏰ Não perca!

[Botão: 💎 Quero Assinar]
```

### Opção 2 - Novidade para VIPs:
```
🎉 NOVO CONTEÚDO DISPONÍVEL!

Acabamos de adicionar material exclusivo no grupo.

Corra para conferir! 🚀
```

### Opção 3 - Reconquistar expirados:
```
😢 Sentimos sua falta!

Você já foi VIP e sabemos que curtiu o conteúdo.

Volte agora e veja tudo que adicionamos! 🎁

[Botão: 🔄 Voltar ao VIP]
```

### Opção 4 - Aviso para todos:
```
📢 COMUNICADO IMPORTANTE

Estamos com novidades incríveis chegando!

Fique ligado! 👀
```

---

## ✅ Pronto para Usar!

Agora é só:
1. Fazer deploy da API
2. Dar duplo clique em `broadcast-rapido.bat`
3. Escolher uma opção
4. Pronto! 🚀

Simples assim! 😊
