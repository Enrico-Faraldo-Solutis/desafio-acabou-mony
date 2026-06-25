# 📋 API Contracts - Acabou o Mony

> **Comprehensive API documentation for all microservices**

## 📑 Table of Contents
1. [Auth Service](#auth-service-port-8081)
2. [Account Service](#account-service-port-8082)
3. [Transaction Service](#transaction-service-port-8083)
4. [Card Service](#card-service-port-8084)
5. [Auditing Service](#auditing-service-port-8085)
6. [Notificação Service](#notificação-service-port-8086)
7. [Common Patterns](#common-patterns)
8. [Error Responses](#error-responses)

---

## Auth Service (Port 8081)

**Base URL**: `http://localhost:8088/api/acabou-mony-auth`

### POST /login
**Description**: Initial login with email and password

**Request:**
```json
{
  "email": "user@example.com",
  "senha": "password123"
}
```

**Response (200 OK):**
```json
{
  "usuarioId": 1,
  "message": "2FA code sent to your email"
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "Invalid credentials",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Validation Rules:**
- `email`: Required, valid email format
- `senha`: Required, min 6 characters

---

### POST /verify-2fa
**Description**: Verify 2FA code and receive JWT token

**Request:**
```json
{
  "usuarioId": 1,
  "codigo": "123456"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "user@example.com"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Invalid or expired 2FA code",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Validation Rules:**
- `usuarioId`: Required, positive integer
- `codigo`: Required, exactly 6 digits

**Token Details:**
- **Algorithm**: HS256
- **Expiration**: 24 hours
- **Claims**: `sub` (usuarioId), `email`, `nome`, `iat`, `exp`

---

### POST /logout
**Description**: Invalidate JWT token (future implementation)

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

---

## Account Service (Port 8082)

**Base URL**: `http://localhost:8088/api/acabou-mony-account`

### POST /users
**Description**: Create new user and account

**Request:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123",
  "cpf": "12345678900"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "cpf": "12345678900",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "conta": {
    "id": 1,
    "saldo": 0.00,
    "status": "ATIVA"
  }
}
```

**Response (409 Conflict):**
```json
{
  "error": "Email or CPF already exists",
  "field": "email",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Validation Rules:**
- `nome`: Required, 3-100 characters
- `email`: Required, valid email format, unique
- `senha`: Required, min 6 characters
- `cpf`: Required, exactly 11 digits, unique, valid CPF

---

### GET /contas/balance/{contaId}
**Description**: Get account balance and details

**Request:**
```
GET /contas/balance/1
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "usuarioId": 1,
  "saldo": 1500.00,
  "status": "ATIVA",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "dataAtualizacao": "2024-01-15T11:00:00Z"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Account not found",
  "contaId": 1,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### PUT /contas/balance
**Description**: Update account balance (internal use)

**Request:**
```json
{
  "contaId": 1,
  "novoSaldo": 1500.00
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "usuarioId": 1,
  "saldo": 1500.00,
  "status": "ATIVA",
  "dataAtualizacao": "2024-01-15T11:00:00Z"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Invalid balance: cannot be negative",
  "novoSaldo": -100.00,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Validation Rules:**
- `contaId`: Required, positive integer
- `novoSaldo`: Required, >= 0, max 2 decimal places

---

### GET /contas
**Description**: List all accounts (paginated, admin only)

**Request:**
```
GET /contas?page=0&size=10&sort=id,desc
Authorization: Bearer <admin-token>
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "usuarioId": 1,
      "saldo": 1500.00,
      "status": "ATIVA"
    },
    {
      "id": 2,
      "usuarioId": 2,
      "saldo": 2500.00,
      "status": "ATIVA"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 234,
  "totalPages": 24
}
```

---

## Transaction Service (Port 8083)

**Base URL**: `http://localhost:8088/api/acabou-mony-transaction`

### POST /transactions
**Description**: Create new transaction (transfer, payment, etc.)

**Request:**
```json
{
  "contaOrigemId": 1,
  "contaDestinoId": 2,
  "valor": 100.00,
  "tipo": "TRANSFERENCIA"
}
```

**Response (200 OK):**
```json
{
  "id": 123,
  "contaOrigemId": 1,
  "contaDestinoId": 2,
  "valor": 100.00,
  "tipo": "TRANSFERENCIA",
  "status": "CONCLUIDA",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response (400 Bad Request - Insufficient Balance):**
```json
{
  "error": "Saldo insuficiente",
  "saldoAtual": 50.00,
  "valorSolicitado": 100.00,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Conta não encontrada",
  "contaId": 999,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Validation Rules:**
- `contaOrigemId`: Required, positive integer, must exist
- `contaDestinoId`: Required, positive integer, must exist, different from origem
- `valor`: Required, > 0.01, max 2 decimal places
- `tipo`: Required, enum: TRANSFERENCIA, PAGAMENTO, DEPOSITO, SAQUE

**Performance Requirements:**
- **Latency**: < 1 second (p95)
- **Throughput**: 1,000 req/s

---

### GET /transactions/{id}
**Description**: Get transaction by ID

**Request:**
```
GET /transactions/123
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 123,
  "contaOrigemId": 1,
  "contaDestinoId": 2,
  "valor": 100.00,
  "tipo": "TRANSFERENCIA",
  "status": "CONCLUIDA",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### GET /transactions/conta/{contaId}
**Description**: Get transaction history for an account

**Request:**
```
GET /transactions/conta/1?page=0&size=20
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 123,
      "contaOrigemId": 1,
      "contaDestinoId": 2,
      "valor": 100.00,
      "tipo": "TRANSFERENCIA",
      "status": "CONCLUIDA",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "id": 124,
      "contaOrigemId": 3,
      "contaDestinoId": 1,
      "valor": 50.00,
      "tipo": "TRANSFERENCIA",
      "status": "CONCLUIDA",
      "timestamp": "2024-01-15T09:00:00Z"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 45
}
```

---

## Card Service (Port 8084)

**Base URL**: `http://localhost:8088/api/acabou-mony-card`

### POST /
**Description**: Generate new card for an account

**Request:**
```json
{
  "contaId": 1,
  "tipo": "DEBITO",
  "limite": 5000.00
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "contaId": 1,
  "numeroCartao": "5412 7534 8901 2345",
  "nomePortador": "JOAO SILVA",
  "validade": "12/2029",
  "cvv": "***",
  "tipo": "DEBITO",
  "status": "ATIVO",
  "limite": 5000.00,
  "dataCriacao": "2024-01-15T10:30:00Z"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Conta não encontrada",
  "contaId": 999,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Validation Rules:**
- `contaId`: Required, positive integer, must exist
- `tipo`: Required, enum: DEBITO, CREDITO
- `limite`: Optional, > 0, max 2 decimal places

**Security Notes:**
- `numeroCartao`: Encrypted (AES-256) in database
- `cvv`: Encrypted (AES-256) in database, always masked in responses
- Card number generated using Luhn algorithm

---

### GET /account/{contaId}
**Description**: List all cards for an account

**Request:**
```
GET /account/1
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "numeroCartao": "5412 7534 8901 2345",
    "nomePortador": "JOAO SILVA",
    "validade": "12/2029",
    "tipo": "DEBITO",
    "status": "ATIVO",
    "limite": 5000.00
  },
  {
    "id": 2,
    "numeroCartao": "4532 1234 5678 9010",
    "nomePortador": "JOAO SILVA",
    "validade": "06/2028",
    "tipo": "CREDITO",
    "status": "BLOQUEADO",
    "limite": 10000.00
  }
]
```

---

### PUT /{id}/toggle-status
**Description**: Block or unblock a card

**Request:**
```
PUT /1/toggle-status
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "numeroCartao": "5412 7534 8901 2345",
  "status": "BLOQUEADO",
  "dataAtualizacao": "2024-01-15T11:00:00Z"
}
```

**Status Transitions:**
- `ATIVO` → `BLOQUEADO`
- `BLOQUEADO` → `ATIVO`

---

## Auditing Service (Port 8085)

**Base URL**: `http://localhost:8088/api/acabou-mony-auditing`

### POST /
**Description**: Register audit log (internal use only)

**Request:**
```json
{
  "usuarioId": 1,
  "acao": "LOGIN",
  "entidadeNome": "Usuario",
  "entidadeId": 1,
  "detalhes": "Login bem-sucedido via 2FA",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0..."
}
```

**Response (201 Created):**
```json
{
  "id": 123,
  "usuarioId": 1,
  "acao": "LOGIN",
  "entidadeNome": "Usuario",
  "entidadeId": 1,
  "detalhes": "Login bem-sucedido via 2FA",
  "ipAddress": "192.168.1.100",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Validation Rules:**
- `usuarioId`: Optional, positive integer
- `acao`: Required, max 100 characters
- `entidadeNome`: Optional, max 100 characters
- `entidadeId`: Optional, positive integer
- `detalhes`: Optional, max 5000 characters

---

### GET /
**Description**: List all audit logs (paginated, admin only)

**Request:**
```
GET /?page=0&size=20&sort=timestamp,desc
Authorization: Bearer <admin-token>
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 123,
      "usuarioId": 1,
      "acao": "LOGIN",
      "entidadeNome": "Usuario",
      "entidadeId": 1,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 1543
}
```

---

### GET /{id}
**Description**: Get specific audit log by ID

**Request:**
```
GET /123
Authorization: Bearer <admin-token>
```

**Response (200 OK):**
```json
{
  "id": 123,
  "usuarioId": 1,
  "acao": "LOGIN",
  "entidadeNome": "Usuario",
  "entidadeId": 1,
  "detalhes": "Login bem-sucedido via 2FA",
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### GET /usuario/{usuarioId}
**Description**: Filter audit logs by user

**Request:**
```
GET /usuario/1?page=0&size=20
Authorization: Bearer <admin-token>
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 123,
      "acao": "LOGIN",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "id": 125,
      "acao": "LOGOUT",
      "timestamp": "2024-01-15T11:00:00Z"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 45
}
```

---

### GET /acao/{acao}
**Description**: Filter audit logs by action

**Request:**
```
GET /acao/LOGIN?page=0&size=20
Authorization: Bearer <admin-token>
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 123,
      "usuarioId": 1,
      "acao": "LOGIN",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "id": 126,
      "usuarioId": 2,
      "acao": "LOGIN",
      "timestamp": "2024-01-15T10:32:00Z"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 234
}
```

---

### GET /entidade
**Description**: Filter audit logs by entity

**Request:**
```
GET /entidade?nome=Transacao&id=456&page=0&size=20
Authorization: Bearer <admin-token>
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 124,
      "usuarioId": 1,
      "acao": "TRANSACAO_CRIADA",
      "entidadeNome": "Transacao",
      "entidadeId": 456,
      "timestamp": "2024-01-15T10:35:00Z"
    },
    {
      "id": 127,
      "usuarioId": 1,
      "acao": "TRANSACAO_CONCLUIDA",
      "entidadeNome": "Transacao",
      "entidadeId": 456,
      "timestamp": "2024-01-15T10:35:05Z"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 2
}
```

---

## Notificação Service (Port 8086)

**Base URL**: `http://localhost:8088/api/acabou-mony-notificacao`

**Note**: This service is primarily a RabbitMQ consumer. REST API endpoints are planned for future implementation.

### Future Endpoints

#### GET /notificacoes/usuario/{usuarioId}
**Description**: Get all notifications for a user

**Request:**
```
GET /notificacoes/usuario/1?page=0&size=20
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "tipo": "USUARIO_CRIADO",
      "mensagem": "Bem-vindo! Sua conta foi criada.",
      "lida": false,
      "dataEnvio": "2024-01-15T10:30:05Z"
    },
    {
      "id": 2,
      "tipo": "TRANSACAO_CONCLUIDA",
      "mensagem": "Transferência de R$ 100,00 realizada.",
      "lida": true,
      "dataEnvio": "2024-01-15T10:35:05Z",
      "dataLeitura": "2024-01-15T10:36:00Z"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 45
}
```

---

#### PUT /notificacoes/{id}/marcar-lida
**Description**: Mark notification as read

**Request:**
```
PUT /notificacoes/1/marcar-lida
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "lida": true,
  "dataLeitura": "2024-01-15T11:00:00Z"
}
```

---

## Common Patterns

### Authentication
All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Pagination
Paginated endpoints support these query parameters:

- `page`: Page number (0-indexed, default: 0)
- `size`: Page size (default: 20, max: 100)
- `sort`: Sort field and direction (e.g., `id,desc`)

**Example:**
```
GET /transactions/conta/1?page=0&size=10&sort=timestamp,desc
```

### Date/Time Format
All timestamps use ISO 8601 format:

```
2024-01-15T10:30:00Z
```

### Monetary Values
All monetary values use `BigDecimal` with 2 decimal places:

```json
{
  "valor": 100.00,
  "saldo": 1500.50
}
```

---

## Error Responses

### 400 Bad Request
**Invalid input or validation error**

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "must be a valid email address"
    },
    {
      "field": "valor",
      "message": "must be greater than 0"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### 401 Unauthorized
**Missing or invalid authentication**

```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### 403 Forbidden
**Insufficient permissions**

```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### 404 Not Found
**Resource not found**

```json
{
  "error": "Not Found",
  "message": "Conta não encontrada",
  "resourceId": 999,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### 409 Conflict
**Resource already exists**

```json
{
  "error": "Conflict",
  "message": "Email already exists",
  "field": "email",
  "value": "user@example.com",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### 500 Internal Server Error
**Unexpected server error**

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "timestamp": "2024-01-15T10:30:00Z",
  "traceId": "abc123def456"
}
```

---

## Testing with cURL

### Login Flow
```bash
# 1. Login
curl -X POST http://localhost:8088/api/acabou-mony-auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","senha":"password123"}'

# 2. Verify 2FA
curl -X POST http://localhost:8088/api/acabou-mony-auth/verify-2fa \
  -H "Content-Type: application/json" \
  -d '{"usuarioId":1,"codigo":"123456"}'

# 3. Use token
curl -X GET http://localhost:8088/api/acabou-mony-transaction/transactions \
  -H "Authorization: Bearer <token>"
```

### Create Transaction
```bash
curl -X POST http://localhost:8088/api/acabou-mony-transaction/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "contaOrigemId": 1,
    "contaDestinoId": 2,
    "valor": 100.00,
    "tipo": "TRANSFERENCIA"
  }'
```

---

## Swagger UI

Each service provides interactive API documentation via Swagger UI:

- **Auth**: http://localhost:8081/swagger-ui.html
- **Account**: http://localhost:8082/swagger-ui.html
- **Transaction**: http://localhost:8083/swagger-ui.html
- **Card**: http://localhost:8084/swagger-ui.html
- **Auditing**: http://localhost:8085/swagger-ui.html

---

**Last Updated**: 2024-01-15  
**Maintained By**: Development Team  
**Version**: 1.0.0
