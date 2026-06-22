--- a/original_file.md
+++ b/updated_file.md
@@ -51,49 +51,11 @@
 ---

-# Tasks (para o Squad)
-
-## Sprint 1 – Infra & Gateway
-- [ ] Criar `docker-compose.yml` com MySQL, RabbitMQ, NGINX.
-- [ ] Implementar `acabou-mony-gateway` (rotas, filter de logging).
-- [ ] Configurar NGINX como load‑balancer (arquivo `nginx.conf`).
-
-## Sprint 2 – Auth Service
-- [ ] Definir entidade `TwoFactorCode`.
-- [ ] Implementar `AuthController` (login) e `Verify2faController`.
-- [ ] Implementar `AuthService` e `TwoFactorAuthService`.
-- [ ] Persistir códigos 2FA no repo.
-- [ ] Gerar e retornar JWT token upon successful 2FA.
-
-## Sprint 3 – Account Service
-- [ ] Modelar `Usuario`, `Conta` entities.
-- [ ] Repositórios e serviços de CRUD.
-- [ ] Endpoints: `POST /api/accounts/users`, `GET /api/accounts/{id}`, `PUT /api/accounts/balance`.
-- [ ] Integração com `acabou-mony-transaction` via HTTP client.
-
-## Sprint 4 – Transaction Service
-- [ ] Cliente HTTP (`AccountClient`) para chamar `/balance/{id}`.
-- [ ] Repositório `TransacaoRepository`.
-- [ ] Publicar eventos no RabbitMQ ao concluir transação.
-- [ ] Testes de carga (JMeter/Gatling).
-
-## Sprint 5 – Card Service (Dev 1)
-- [ ] Entidade `Cartao`, lógica de criptografia de CVC/número.
-- [ ] Endpoints: `POST /api/cards`, `GET /api/cards/{contaId}`, `PUT /api/cards/{id}/status`.
-
-## Sprint 6 – Auditing Service (Dev 4)
-- [ ] Entidade `AuditLog`.
-- [ ] Endpoint `POST /api/auditing` (uso interno).
-- [ ] Endpoint `GET /api/auditing` (admin only).
-
-## Sprint 7 – Notificação Service (Dev 4)
-- [ ] Configurar consumer do RabbitMQ.
-- [ ] Persistir notificações e expor método interno para leitura.
-
-## Sprint 8 – Segurança & Deploy
-- [ ] Configurar HTTPS (NGINX TLS).
-- [ ] Setup de CI/CD (GitHub Actions).
-- [ ] Documentação (README, HELP.md).
+# Plano de Trabalho (Tasks)
+
+O backlog detalhado do projeto, organizado por Sprints, está documentado no arquivo [tasks.md](tasks.md).

 ---

*Todos os arquivos foram criados na raiz do repositório `desafio-acabou-mony`.*