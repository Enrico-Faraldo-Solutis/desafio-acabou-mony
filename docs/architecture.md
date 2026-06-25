# 🏗️ Arquitetura do Sistema - Acabou o Mony

## 📊 Visão Geral

Sistema de pagamentos baseado em microserviços com arquitetura event-driven.

## 🎯 Componentes Principais

### 1. API Gateway (Port 8088)
- **Responsabilidade**: Ponto de entrada único, roteamento, autenticação
- **Tecnologia**: Spring Cloud Gateway
- **Rotas**:
  - `/api/acabou-mony-auth/**` → Auth Service (8081)
  - `/api/acabou-mony-account/**` → Account Service (8082)
  - `/api/acabou-mony-transaction/**` → Transaction Service (8083)
  - `/api/acabou-mony-card/**` → Card Service (8084)
  - `/api/acabou-mony-auditing/**` → Auditing Service (8085)

### 2. Auth Service (Port 8081)
- **Responsabilidade**: Autenticação, 2FA, JWT
- **Banco**: MySQL (`db_acabou_mony`)
- **Endpoints**:
  - `POST /login` - Login inicial
  - `POST /verify-2fa` - Verificação 2FA
  - `POST /logout` - Logout

### 3. Account Service (Port 8082)
- **Responsabilidade**: Gestão de usuários e contas
- **Banco**: MySQL (`db_acabou_mony`)
- **Endpoints**:
  - `POST /users` - Criar usuário
  - `GET /accounts/{id}` - Consultar conta
  - `PUT /accounts/balance` - Atualizar saldo

### 4. Transaction Service (Port 8083)
- **Responsabilidade**: Processar transações
- **Banco**: MySQL (`db_acabou_mony`)
- **Mensageria**: RabbitMQ (publica eventos)
- **Endpoints**:
  - `POST /transactions` - Criar transação
  - `GET /transactions/{id}` - Consultar transação
  - `GET /transactions/conta/{contaId}` - Histórico

### 5. Card Service (Port 8084)
- **Responsabilidade**: Gestão de cartões
- **Banco**: MySQL (`db_acabou_mony`)
- **Endpoints**:
  - `POST /cards` - Criar cartão
  - `GET /cards/{contaId}` - Listar cartões
  - `PUT /cards/{id}/status` - Bloquear/desbloquear

### 6. Auditing Service (Port 8085)
- **Responsabilidade**: Logs de auditoria
- **Banco**: MySQL (`db_acabou_mony`)
- **Endpoints**:
  - `POST /auditing` - Registrar log (interno)
  - `GET /auditing` - Consultar logs (admin)

### 7. Notificação Service (Port 8086)
- **Responsabilidade**: Envio de notificações
- **Mensageria**: RabbitMQ (consumer)
- **Banco**: MySQL (`db_acabou_mony`)

### 8. Frontend (Port 5173)
- **Tecnologia**: React + Vite
- **Comunicação**: API Gateway (8088)

## 🔄 Fluxo de Comunicação

### Fluxo de Transação
```
Frontend → Gateway → Transaction Service
                    ↓
                Account Service (validar saldo)
                    ↓
                RabbitMQ (publicar evento)
                    ↓
                Notificação Service (consumer)
```

### Fluxo de Autenticação
```
Frontend → Gateway → Auth Service (login)
                    ↓
                Email/SMS (2FA code)
                    ↓
Frontend → Gateway → Auth Service (verify-2fa)
                    ↓
                JWT Token → Frontend
```

## 🐳 Infraestrutura

### Docker Compose
- **MySQL**: Port 3307 (host) → 3306 (container)
- **RabbitMQ**: Port 5672 (AMQP), 15672 (Management UI)
- **NGINX**: Port 80 (load balancer)

### NGINX Load Balancer
- Distribui requisições entre instâncias dos serviços
- Health checks configurados
- Timeout: 60 segundos

## 📊 Diagrama de Arquitetura

```
┌─────────────┐
│   Frontend  │ (React - Port 5173)
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────┐
│   NGINX     │ (Load Balancer - Port 80)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Gateway    │ (Port 8088)
└──────┬──────┘
       │
       ├─────────────────┬─────────────────┬──────────────┐
       ▼                 ▼                 ▼              ▼
┌──────────┐      ┌──────────┐     ┌──────────┐   ┌──────────┐
│   Auth   │      │ Account  │     │Transaction│   │   Card   │
│  (8081)  │      │  (8082)  │     │  (8083)  │   │  (8084)  │
└────┬─────┘      └────┬─────┘     └────┬─────┘   └────┬─────┘
     │                 │                 │              │
     └─────────────────┴─────────────────┴──────────────┘
                       │
                       ▼
                ┌─────────────┐
                │    MySQL    │ (Port 3307)
                └─────────────┘
                       ▲
                       │
     ┌─────────────────┴─────────────────┐
     │                                    │
┌────┴─────┐                      ┌──────┴──────┐
│ Auditing │                      │ Notificação │
│  (8085)  │                      │   (8086)    │
└──────────┘                      └──────┬──────┘
                                         ▲
                                         │
                                  ┌──────┴──────┐
                                  │  RabbitMQ   │ (Port 5672)
                                  └─────────────┘
```

## 🔐 Segurança

### Autenticação
- JWT tokens emitidos pelo Auth Service
- Tokens validados no Gateway
- Expiração: 24 horas (configurável)

### Autorização
- Role-based access control (RBAC)
- Roles: USER, ADMIN
- Endpoints protegidos por role

### Criptografia
- Senhas: BCrypt
- Dados sensíveis: AES-256
- Comunicação: HTTPS (produção)

## 📈 Escalabilidade

### Horizontal Scaling
- Todos os serviços são stateless
- Load balancing via NGINX
- RabbitMQ para desacoplamento

### Performance
- Connection pooling (HikariCP)
- Cache (Redis - futuro)
- Índices no banco de dados

## 🔍 Monitoramento

### Logs
- Centralizados (ELK Stack - futuro)
- Níveis: INFO, WARN, ERROR
- Contexto: IDs, timestamps, user info

### Métricas
- Spring Boot Actuator
- Prometheus + Grafana (futuro)
- Alertas configurados

## 🚀 Deploy

### Ambientes
- **Development**: Docker Compose local
- **Staging**: Kubernetes (futuro)
- **Production**: Kubernetes (futuro)

### CI/CD
- GitHub Actions
- Build → Test → Deploy
- Rollback automático em caso de falha

---

**Última atualização**: 2024-01-15
