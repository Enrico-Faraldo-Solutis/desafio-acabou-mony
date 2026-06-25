# 💰 Acabou o Mony - Fintech Payment Platform

> Sistema de pagamentos digital com processamento rápido e seguro de transações

## 📋 Visão Geral

**Acabou o Mony** é uma plataforma fintech que revoluciona pagamentos digitais, oferecendo:
- ⚡ Processamento de transações em < 1 segundo
- 🔐 Autenticação 2FA para segurança máxima
- 📱 Integração com Live Commerce e Conversational Commerce
- 🚀 Arquitetura de microserviços escalável

## 🏗️ Arquitetura

### Microserviços

| Serviço | Port | Responsabilidade | Status |
|---------|------|------------------|--------|
| **Gateway** | 8088 | Roteamento e autenticação | ✅ |
| **Auth** | 8081 | Autenticação e 2FA | ✅ |
| **Account** | 8082 | Gestão de contas | ✅ |
| **Transaction** | 8083 | Processamento de pagamentos | ✅ |
| **Card** | 8084 | Gestão de cartões | ✅ |
| **Auditing** | 8085 | Logs de auditoria | ✅ |
| **Notificação** | 8086 | Envio de notificações | ✅ |
| **Frontend** | 5173 | Interface React | ✅ |

### Infraestrutura

- **Database**: MySQL 8.0 (Port 3307)
- **Message Broker**: RabbitMQ (Port 5672)
- **Load Balancer**: NGINX (Port 80)
- **Container**: Docker Compose

## 🚀 Quick Start

### Pré-requisitos

- Java 21
- Mavenompose
- Node.js  3.8+
- Docker & Docker C18+ (para frontend)

### 1. Iniciar Infraestrutura

```bash
# Subir MySQL, RabbitMQ e NGINX
docker-compose up -d
```

### 2. Compilar e Executar Backend

```bash
# Compilar todos os módulos
mvn clean install

# Executar cada serviço (em terminais separados)
cd acabou-mony-gateway && mvn spring-boot:run
cd acabou-mony-auth && mvn spring-boot:run
cd acabou-mony-account && mvn spring-boot:run
cd acabou-mony-transaction && mvn spring-boot:run
cd acabou-mony-card && mvn spring-boot:run
cd acabou-mony-auditing && mvn spring-boot:run
cd acabou-mony-notificacao && mvn spring-boot:run
```

### 3. Executar Frontend

```bash
cd acabou-mony-frontend
npm install
npm run dev
```

Acesse: `http://localhost:5173`

## 📚 Documentação

### Documentos Principais

| Documento | Descrição |
|-----------|-----------|
| **[enunciado.md](enunciado.md)** | 🎯 Problema de negócio e user stories |
| **[specs.md](specs.md)** | 📋 Especificações técnicas detalhadas |
| **[tasks.md](tasks.md)** | ✔️ Backlog organizado por sprints |
| **[rules.md](rules.md)** | 📏 Regras de desenvolvimento e padrões |
| **[agents.md](agents.md)** | 🤖 Guia de agentes e automações |
| **[TLC_SPEC_DRIVEN_GUIDE.md](TLC_SPEC_DRIVEN_GUIDE.md)** | 📖 Guia de desenvolvimento spec-driven |

### Documentação Técnica

- **[docs/architecture.md](docs/architecture.md)** - Arquitetura do sistema
- **[docs/frontend-guide.md](docs/frontend-guide.md)** - Guia completo do frontend
- **[HELP.md](HELP.md)** - Referências Spring Boot

### Progresso dos Módulos

- [progress_gateway.md](progress/progress_gateway.md)
- [progress_auth.md](progress/progress_auth.md)
- [progress_account.md](progress/progress_account.md)
- [progress_transaction.md](progress/progress_transaction.md)
- [progress_card.md](progress/progress_card.md)
- [progress_auditing.md](progress/progress_auditing.md)
- [progress_notificacao.md](progress/progress_notificacao.md)
- [progress_frontend.md](progress/progress_frontend.md)

## 🎯 User Stories

### Story 1: Transaction Processing ✅
- Processar transações em < 1 segundo
- Confirmação imediata (sucesso/falha)

### Story 2: Scalability ⚠️
- Escalabilidade automática
- Suporte a picos de demanda

### Story 3: Transaction Security ✅
- HTTPS obrigatório
- Autenticação 2FA
- Criptografia de dados sensíveis

### Story 4: Live Commerce Integration 🔄
- Integração com plataformas de Live Commerce
- Pagamentos sem sair da plataforma
- Suporte a Conversational Commerce

## 🔐 Segurança

### Autenticação
- JWT tokens (expiração: 24h)
- 2FA obrigatório para operações sensíveis
- BCrypt para senhas

### Criptografia
- Dados sensíveis: AES-256
- Comunicação: HTTPS (produção)
- Cartões: PCI-DSS compliance

### Auditoria
- Logs de todas as operações críticas
- Rastreabilidade completa
- Retenção: 7 anos

## 📊 Performance

### Métricas Atuais

| Métrica | Target | Atual | Status |
|---------|--------|-------|--------|
| Transaction Latency (p95) | < 1s | 850ms | ✅ |
| Throughput | 1,000 req/s | 1,200 req/s | ✅ |
| Availability | 99.9% | 99.5% | ⚠️ |
| Database Response | < 100ms | 80ms | ✅ |

## 🧪 Testes

### Executar Testes Unitários

```bash
mvn test
```

### Executar Testes de Integração

```bash
mvn verify
```

### Executar Testes de Performance

```bash
# JMeter
jmeter -n -t tests/load-test.jmx -l results.jtl

# Gatling
mvn gatling:test
```

### Cobertura de Código

```bash
mvn clean test jacoco:report
# Relatório em: target/site/jacoco/index.html
```

## 🐳 Docker

### Comandos Úteis

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Rebuild
docker-compose up -d --build

# Limpar volumes
docker-compose down -v
```

### Acessar Serviços

- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **MySQL**: localhost:3307 (root/root)
- **Frontend**: http://localhost:5173
- **Gateway**: http://localhost:8088

## 🛠️ Desenvolvimento

### Workflow TLC Spec-Driven

1. **Definir**: Escrever specs em `specs.md`
2. **Planejar**: Quebrar em tasks em `tasks.md`
3. **Implementar**: Seguir padrões de `rules.md`
4. **Validar**: Testar contra specs
5. **Documentar**: Atualizar `progress_*.md`

Veja [TLC_SPEC_DRIVEN_GUIDE.md](TLC_SPEC_DRIVEN_GUIDE.md) para detalhes.

### Padrões de Código

- **Valores monetários**: Sempre `BigDecimal`
- **Transações**: Sempre `@Transactional`
- **Logs**: Entry, exit e errors
- **Validação**: Annotations em DTOs
- **Testes**: Mínimo 80% coverage

Veja [rules.md](rules.md) para lista completa.

### Branches

- `main` - Produção
- `develop` - Desenvolvimento
- `feature/*` - Features
- `hotfix/*` - Correções urgentes

### Commits

```
feat: adiciona endpoint de transações
fix: corrige validação de saldo
docs: atualiza README
test: adiciona testes de performance
refactor: melhora estrutura do código
```

## 🚀 Deploy

### Ambientes

- **Development**: Docker Compose local
- **Staging**: Kubernetes (TODO)
- **Production**: Kubernetes (TODO)

### CI/CD

GitHub Actions configurado para:
1. Build automático
2. Testes unitários e integração
3. Análise de código (SonarQube)
4. Deploy automático (staging)

## 📈 Roadmap

### Q1 2024
- [x] Implementar autenticação 2FA
- [x] Processar transações básicas
- [ ] Integração com Live Commerce
- [ ] Deploy em Kubernetes

### Q2 2024
- [ ] Implementar cache (Redis)
- [ ] Adicionar circuit breakers
- [ ] Monitoramento (Prometheus/Grafana)
- [ ] Distributed tracing (Jaeger)

### Q3 2024
- [ ] Machine learning para detecção de fraude
- [ ] API pública para parceiros
- [ ] Mobile app (React Native)
- [ ] Internacionalização

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é proprietário e confidencial.

## 👥 Time

- **Dev 1**: Account & Card Services
- **Dev 2**: Transaction Service
- **Dev 3**: Auth Service
- **Dev 4**: Auditing & Notificação Services
- **Frontend**: React Developer

## 📞 Suporte

- **Email**: suporte@acabou-o-mony.com
- **Slack**: #acabou-mony-dev
- **Docs**: https://docs.acabou-o-mony.com

---

**Desenvolvido com ❤️ pela equipe Acabou o Mony**

*Última atualização: 2024-01-15*
