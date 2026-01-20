# Funis de Vendas e Mensagens

## Tipos de Funis

### 1. Funil VIP
**Quando é acionado**: Usuário já está no grupo VIP

**Sequência de mensagens**:
1. Boas-vindas de volta
2. Benefícios do VIP
3. Dica de engajamento

**Objetivo**: Engajar membros ativos

---

### 2. Funil de Vendas - Primeira Visita
**Quando é acionado**: Usuário não está no VIP e nunca usou /start

**Sequência de mensagens**:
1. Boas-vindas inicial
2. Apresentação dos benefícios
3. Call-to-action com botão de assinatura

**Objetivo**: Converter novo usuário em assinante

---

### 3. Funil de Vendas - Retorno
**Quando é acionado**: Usuário não está no VIP mas já usou /start antes

**Sequência de mensagens**:
1. Boas-vindas de retorno
2. Urgência e prova social
3. Call-to-action reforçado

**Objetivo**: Reengajar usuário que não converteu

---

## Personalização de Mensagens

### Localização
Todas as mensagens estão em português brasileiro (pt-BR).

### Arquivos de Mensagens

- **VIP**: `apps/bot/src/ui/messages/vip.ts`
- **Vendas**: `apps/bot/src/ui/messages/sales.ts`
- **Renovação**: `apps/worker/src/templates/renewal.pt-br.ts`

### Como Editar

1. Abra o arquivo correspondente
2. Edite o texto mantendo a estrutura
3. Reinicie o bot/worker

**Exemplo:**
```typescript
export const VIP_SEQUENCE = [
  {
    step: 1,
    text: `🎉 Sua mensagem personalizada aqui!`,
  },
  // ...
];
```

---

## Mensagens de Renovação

### D-7 (7 dias antes)
Lembrete amigável sobre expiração próxima.

### D-3 (3 dias antes)
Aviso mais urgente com call-to-action.

### D-1 (1 dia antes)
Último aviso com urgência máxima.

### D0 (dia da expiração)
Notificação de expiração e remoção do grupo.

---

## Boas Práticas

1. **Seja claro**: Mensagens diretas e objetivas
2. **Use emojis**: Tornam mensagens mais amigáveis
3. **Call-to-action**: Sempre indique próximo passo
4. **Personalização**: Use nome do usuário quando possível
5. **Teste**: Sempre teste mudanças antes de produção

---

## Métricas Sugeridas

- Taxa de conversão por funil
- Tempo médio até conversão
- Taxa de renovação por período
- Engajamento pós-assinatura
