# 🗺️ Plano de Desenvolvimento & Contrato Arquitetural — "Acabou o Mony"

Este documento serve como o guia oficial do Squad para o desenvolvimento do ecossistema **Acabou o Mony**. Ele detalha a divisão de responsabilidades entre os desenvolvedores, o mapa de portas do ambiente de desenvolvimento, os contratos de API e as regras de comunicação entre os microsserviços.

---

## 👥 1. Divisão do Squad & Domínios

Para garantir autonomia total e **evitar conflitos de merge (`git merge conflicts`)**, o desenvolvimento foi dividido em 4 frentes de trabalho isoladas:

### 🔹 [DEV 1] Core Financeiro & Cartões
* **Módulos:** `acabou-mony-account` e `acabou-mony-card`
* **Foco:** Cadastro de usuários, abertura e gerenciamento de contas, controle de saldos, geração de cartões (físicos/virtuais), mascaramento e criptografia de dados sensíveis (CVC/Número).

### 🔹 [DEV 2] Motor de Pagamentos
* **Módulos:** `acabou-mony-transaction`
* **Foco:** Processamento de transações em alta performance, validação de saldo via chamadas síncronas HTTP e publicação de eventos de sucesso/falha na mensageria.

### 🔹 [DEV 3] Segurança, Roteamento & Infraestrutura
* **Módulos:** `acabou-mony-auth`, `acabou-mony-gateway` e `nginx/`
* **Foco:** Autenticação de usuários, geração e validação de tokens JWT, lógica de segundo fator de autenticação (2FA) e roteamento centralizado de requisições.

### 🔹 [DEV 4] Observabilidade & Assincronismo
* **Módulos:** `acabou-mony-auditing` e `acabou-mony-notificacao`
* **Foco:** Registro imutável de logs e auditoria regulatória via HTTP síncrono e consumo de eventos da fila do RabbitMQ para geração de notificações.

---

## 🔌 2. Mapa do Ambiente de Desenvolvimento (Portas)

Ao rodar a infraestrutura em containers (**Docker**) e as aplicações Java localmente na IDE (**IntelliJ/VS Code**), o Squad deve respeitar o seguinte mapeamento de portas:

| Serviço / Componente | Porta Local (IDE) | Porta Docker (Container) | Tipo |
| :--- | :--- | :--- | :--- |
| **NGINX** (Load Balancer) | — | `80` / `443` | Infraestrutura |
| **MySQL Server** | — | `3307` (Interna: `3306`) | Banco de Dados |
| **RabbitMQ Dashboard** | — | `15672` (Interna: `5672`) | Mensageria |
| **acabou-mony-gateway** | `8080` | `8083` | API Gateway |
| **acabou-mony-auth** | `8081` | `8091` | Microsserviço |
| **acabou-mony-account** | `8082` | `8082` | Microsserviço |
| **acabou-mony-transaction**| `8084` | `8084` | Microsserviço |
| **acabou-mony-card** | `8085` | `8085` | Microsserviço |
| **acabou-mony-auditing** | `8086` | `8086` | Microsserviço |
| **acabou-mony-notificacao**| `8087` | `8087` | Microsserviço (Worker) |

---

## 🛣️ 3. Matriz de Endpoints das APIs

### 🔑 Auth Service (`:8081`)
> **Nota de Segurança:** Todos os demais microsserviços exigem o Header `Authorization: Bearer <TOKEN>` gerado por este componente.

* `POST /api/auth/login` — Recebe e-mail/senha. Valida e gera um código 2FA temporário no banco. Retorna sucesso parcial.
* `POST /api/auth/verify-2fa` — Recebe o ID do usuário e o código de 6 dígitos. Valida e retorna o Token JWT definitivo.

### 🏦 Account Service (`:8082`)
* `POST /api/accounts/users` — Cria um novo usuário e abre automaticamente uma conta corrente zerada para ele.
* `GET /api/accounts/users/{id}` — Retorna os dados cadastrais do usuário e os detalhes de suas contas.
* `GET /api/accounts/balance/{contaId}` — Retorna o saldo atualizado de uma conta específica.
* `PUT /api/accounts/balance` — **[USO INTERNO]** Sofre mutação de saldo (Débito/Crédito) comandada pelo Motor de Transações.

### 💳 Card Service (`:8085`)
* `POST /api/cards` — Solicita a emissão de um novo cartão físico ou virtual atrelado a uma conta corrente.
* `GET /api/cards/{contaId}` — Lista os cartões vinculados à conta com o número e CVC devidamente mascarados.
* `PUT /api/cards/{id}/status` — Altera o estado do cartão (Ativo, Bloqueado, Cancelado).

### 💸 Transaction Service (`:8084`)
* `POST /api/transactions` — Inicia o fluxo de pagamento/transferência (Origem, Destino, Valor).
* `GET /api/transactions/{accountId}` — Retorna o extrato histórico de movimentações daquela conta.

### 📜 Auditing Service (`:8086`)
* `POST /api/auditing` — **[USO INTERNO]** Grava uma ação imutável no banco de dados.
* `GET /api/auditing` — Lista os logs de auditoria (Acesso restrito a perfis `ROLE_ADMIN`).

---

## 🔀 4. Contrato de Comunicação Inter-Serviços

A arquitetura do ecossistema baseia-se em dois modelos de comunicação clara, divididos por criticidade:

[Cliente] ➔ [NGINX:80] ➔ [Gateway:8080]
│
┌──────────────────┴──────────────────┐
▼ (Síncrono HTTP)                     ▼ (Assíncrono AMQP)
[Transaction] ➔ [Account]              [Transaction]
│                                      │
▼ (Síncrono HTTP)                      ▼ (Fila RabbitMQ)
[Auditing]                            [Notificação]


### 1. Comunicação Síncrona (HTTP / REST)
Utilizada onde a consistência imediata dos dados é obrigatória para o negócio. Deve ser implementada utilizando **OpenFeign** ou **RestTemplate**.

* **Validação de Saldo (`Transaction` ➔ `Account`):** Antes de aprovar qualquer transação, o `Transaction Service` faz uma chamada `GET /api/accounts/balance/{contaId}` para verificar se há fundos. Havendo saldo, dispara um `PUT /api/accounts/balance` para efetivar a transferência.
* **Trilha de Auditoria (`Qualquer Serviço` ➔ `Auditing`):** Ações críticas (Logins efetuados, alteração de dados cadastrais, bloqueios de cartões e movimentações financeiras) realizam obrigatoriamente um `POST /api/auditing` antes de responder ao cliente final.

### 2. Comunicação Assíncrona (Event-Driven via RabbitMQ)
Utilizada para processos secundários que não podem travar a experiência do usuário ou impactar o tempo de resposta da API principal.

* **Notificação de Sucesso (`Transaction` ➔ `RabbitMQ` ➔ `Notificacao`):** Assim que uma transação é confirmada e persistida com o status `CONCLUIDA`, o `Transaction Service` publica um evento JSON na Exchange do RabbitMQ.
* O microsserviço `acabou-mony-notificacao` (que não expõe endpoints HTTP) consome a fila de forma assíncrona, processa o envio simulado e persiste a mensagem na tabela `notificacoes`.

---

## 📝 5. Definições de Pronto (Definition of Done - DoD)

Para que uma tarefa seja considerada concluída e possa ser integrada na branch `integracao`, o desenvolvedor deve garantir:
1.  **Swagger/OpenAPI:** Documentação do endpoint atualizada e testada via interface gráfica na porta local.
2.  **Segurança:** Endpoints protegidos contra acessos sem Token JWT (com exceção das rotas públicas do `auth`).
3.  **Variáveis de Ambiente:** Nenhuma credencial, senha de banco ou chave de API (como a do *SendGrid*) pode estar explícita (*hardcoded*) nos arquivos `application.properties`. Use placeholders (`${VARIAVEL:padrao}`).
4.  **Git Clean:** Certificar-se de que a pasta `target/` e arquivos locais da IDE (`.idea/`, `.vscode/`) estão ignorados pelo `.gitignore` e não foram acidentalmente comitados.