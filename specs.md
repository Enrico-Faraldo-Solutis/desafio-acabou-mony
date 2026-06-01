# Especificação do Projeto "Acabou o Mony"

## Visão Geral
Sistema de payments completo composto por microserviços independentes, focado em alta performance, segurança e escalabilidade.

## Microsserviços
| Serviço | Responsabilidade | Tecnologias |
|--------|-------------------|-------------|
| **gateway** | API Gateway (NGINX + Spring Cloud Gateway) | Java 21, Spring Boot, Spring Cloud Gateway |
| **auth** | Autenticação, 2FA, geração de token | Java 21, Spring Boot, JPA, H2 |
| **account** | Gestão de contas, usuários, saldo | Java 21, Spring Boot, JPA, PostgreSQL |
| **transaction** | Processamento de pagamentos, integração com account | Java 21, Spring Boot, RabbitMQ, Feign/RestTemplate |
| **card** | Criação e gestão de cartões | Java 21, Spring Boot, JPA |
| **auditing** | Logs imutáveis de auditoria | Java 21, Spring Boot, JPA |
| **notificacao** | Consumo assíncrono de eventos RabbitMQ | Java 21, Spring Boot, RabbitMQ |

## Contratos de Comunicação
- **Transação → Account**: HTTP GET `/api/accounts/balance/{id}` (síncrono)  
- **Qualquer Service → Auditing**: HTTP POST `/api/auditing` (síncrono)  
- **Transação → Notificação**: Publicação na exchange RabbitMQ (assíncrono)  

## Requisitos Não‑Funcionais
- **Performance**: Processamento < 1 s por transação.  
- **Escalabilidade**: Escalamento automático via Kubernetes/Docker compose.  
- **Segurança**: HTTPS, 2FA, encriptação de CVC, auditoria completa.  
- **Disponibilidade**: 99.9% uptime,健康检查 via actuator.  

## Stack Tecnológica
- **JDK**: 21 (OpenJDK)  
- **Construção**: Maven  
- **Banco**: PostgreSQL (prod), H2 (dev)  
- **Mensageria**: RabbitMQ  
- **Infra**: Docker‑compose (MySQL, RabbitMQ, NGINX)  
- **Monitoramento**: Spring Actuator, Prometheus, Grafana  

---  

# Tasks (para o Squad)

## Sprint 1 – Infra & Gateway
- [ ] Criar `docker-compose.yml` com MySQL, RabbitMQ, NGINX.  
- [ ] Implementar `acabou-mony-gateway` (rotas, filter de logging).  
- [ ] Configurar NGINX como load‑balancer (arquivo `nginx.conf`).  

## Sprint 2 – Auth Service
- [ ] Definir entidade `TwoFactorCode`.  
- [ ] Implementar `AuthController` (login) e `Verify2faController`.  
- [ ] Implementar `AuthService` e `TwoFactorAuthService`.  
- [ ] Persistir códigos 2FA no repo.  
- [ ] Gerar e retornar JWT token upon successful 2FA.  

## Sprint 3 – Account Service
- [ ] Modelar `Usuario`, `Conta` entities.  
- [ ] Repositórios e serviços de CRUD.  
- [ ] Endpoints: `POST /api/accounts/users`, `GET /api/accounts/{id}`, `PUT /api/accounts/balance`.  
- [ ] Integração com `acabou-mony-transaction` via HTTP client.  

## Sprint 4 – Transaction Service
- [ ] Cliente HTTP (`AccountClient`) para chamar `/balance/{id}`.  
- [ ] Repositório `TransacaoRepository`.  
- [ ] Publicar eventos no RabbitMQ ao concluir transação.  
- [ ] Testes de carga (JMeter/Gatling).  

## Sprint 5 – Card Service (Dev 1)
- [ ] Entidade `Cartao`, lógica de criptografia de CVC/número.  
- [ ] Endpoints: `POST /api/cards`, `GET /api/cards/{contaId}`, `PUT /api/cards/{id}/status`.  

## Sprint 6 – Auditing Service (Dev 4)
- [ ] Entidade `AuditLog`.  
- [ ] Endpoint `POST /api/auditing` (uso interno).  
- [ ] Endpoint `GET /api/auditing` (admin only).  

## Sprint 7 – Notificação Service (Dev 4)
- [ ] Configurar consumer do RabbitMQ.  
- [ ] Persistir notificações e expor método interno para leitura.  

## Sprint 8 – Segurança & Deploy
- [ ] Configurar HTTPS (NGINX TLS).  
- [ ] Setup de CI/CD (GitHub Actions).  
- [ ] Documentação (README, HELP.md).  

---  

# Agents (para automação)

| Agent Type | Descrição | Ferramentas Acessíveis |
|------------|-----------|------------------------|
| **explore** | Busca rápida de arquivos e padrões de código | `bash`, `grep`, `glob` |
| **general** | Executa tarefas multi‑step complexas (build, test, deploy) | `bash`, `mvn`, `docker`, `git` |
| **customize-opencode** | Modifica apenas a configuração interna do opencode (opencode.json, .opencode/, etc.) | `edit`, `read` |

---  

# Skills (referências internas)

- **customize-opencode** – Utilizado exclusivamente para ajustes em arquivos de configuração do opencode (ex.: `opencode.json`, diretórios `.opencode/`).  
- **security‑best‑practices** – Guia de padrões de segurança (HTTPS, token handling, encripção).  
- **docker‑compose‑quickstart** – Scripts e exemplos para levantar serviços auxiliares (MySQL, RabbitMQ, NGINX).  

---  

*Todos os arquivos foram criados na raiz do repositório `desafio-acabou-mony`.*