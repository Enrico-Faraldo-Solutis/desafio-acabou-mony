# Tasks do Projeto "Acabou o Mony"

## Sprint 1 – Infraestrutura
- [ ] Criar `docker-compose.yml` com MySQL, RabbitMQ e NGINX.
- [ ] Configurar NGINX (arquivo `nginx/nginx.conf`) como load‑balancer.
- [ ] Implementar `acabou-mony-gateway` com rotas básicas e filter de logging.

## Sprint 2 – Autenticação (Dev 3)
- [ ] Modelar entidade `TwoFactorCode`.
- [ ] Implementar `AuthController` (login) e `Verify2faController`.
- [ ] Desenvolver `AuthService` e `TwoFactorAuthService`.
- [ ] Persistir códigos 2FA em `TwoFactorCodeRepository`.
- [ ] Emitir JWT token ao final da verificação.

## Sprint 3 – Contas (Dev 1)
- [ ] Criar entidades `Usuario` e `Conta`.
- [ ] Implementar CRUD de usuários e contas.
- [ ] Expor endpoints: `POST /api/accounts/users`, `GET /api/accounts/{id}`, `PUT /api/accounts/balance`.
- [ ] Integrar com `acabou-mony-transaction` via HTTP client.

## Sprint 4 – Pagamentos (Dev 2)
- [ ] Criar cliente HTTP (`AccountClient`) para chamar o serviço de contas.
- [ ] Implementar `TransacaoController` e `TransacaoService`.
- [ ] Persistir transações em `TransacaoRepository`.
- [ ] Publicar evento na exchange do RabbitMQ ao concluir pagamento.
- [ ] Executar testes de carga (JMeter/Gatling).

## Sprint 5 – Cartões (Dev 1)
- [ ] Modelar entidade `Cartao` com criptografia de CVC/número.
- [ ] Implementar CRUD de cartões (`CardController`).
- [ ] Endpoints: `POST /api/cards`, `GET /api/cards/{contaId}`, `PUT /api/cards/{id}/status`.

## Sprint 6 – Auditoria (Dev 4)
- [ ] Modelar `AuditLog`.
- [ ] Implementar `AuditingController` (POST interno, GET admin).
- [ ] Garantir gravação síncrona em todos os eventos críticos.

## Sprint 7 – Notificações (Dev 4)
- [ ] Configurar consumer do RabbitMQ.
- [ ] Persistir notificações em `NotificacaoRepository`.
- [ ] Expor API interna para leitura de notificações.

## Sprint 8 – Segurança & Deploy
- [ ] Configurar TLS/HTTPS no NGINX.
- [ ] Implementar CI/CD com GitHub Actions.
- [ ] Gerar documentação (README, HELP.md, specs.md).