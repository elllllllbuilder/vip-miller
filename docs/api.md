# Documentação da API

## Base URL
```
http://localhost:3000
```

## Endpoints

### Health Check

#### GET /health
Verifica status da API e conexão com banco de dados.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T10:00:00.000Z",
  "database": "connected"
}
```

---

### Pagamentos

#### POST /payments/pix
Cria um novo pagamento Pix via SyncPay.

**Request Body:**
```json
{
  "telegram_user_id": "123456789",
  "plan_id": "monthly_vip"
}
```

**Response:**
```json
{
  "payment_id": "uuid",
  "pix_copy_paste": "00020126580014br.gov.bcb.pix...",
  "pix_qr_code": "https://...",
  "amount": 2990
}
```

**Status Codes:**
- 201: Pagamento criado com sucesso
- 400: Dados inválidos
- 404: Usuário não encontrado

#### GET /payments
Lista todos os pagamentos.

**Query Parameters:**
- `limit` (opcional): Número de resultados (padrão: 100)
- `offset` (opcional): Offset para paginação (padrão: 0)

**Response:**
```json
{
  "payments": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "amount": 2990,
      "status": "paid",
      "created_at": "2024-01-20T10:00:00.000Z",
      "user": {
        "first_name": "João"
      }
    }
  ]
}
```

---

### Webhooks

#### POST /webhooks/syncpay
Recebe notificações de pagamento do SyncPay.

**Headers:**
```
X-SyncPay-Signature: <hmac_sha256_signature>
```

**Request Body:**
```json
{
  "event": "charge.paid",
  "charge_id": "charge_123",
  "status": "paid",
  "paid_at": "2024-01-20T10:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "subscription_id": "uuid"
}
```

**Status Codes:**
- 200: Webhook processado
- 401: Assinatura inválida
- 500: Erro no processamento

---

### Assinaturas

#### GET /subscriptions
Lista todas as assinaturas.

**Query Parameters:**
- `limit` (opcional): Número de resultados
- `offset` (opcional): Offset para paginação

**Response:**
```json
{
  "subscriptions": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "status": "active",
      "plan_id": "monthly_vip",
      "expires_at": "2024-02-20T10:00:00.000Z",
      "user": {
        "first_name": "João"
      }
    }
  ]
}
```

---

## Códigos de Status

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Requisição inválida
- **401**: Não autorizado
- **404**: Não encontrado
- **500**: Erro interno do servidor

## Autenticação

Atualmente a API não requer autenticação para endpoints públicos. Em produção, implementar:
- JWT para endpoints administrativos
- API Key para integrações
- Rate limiting por IP
