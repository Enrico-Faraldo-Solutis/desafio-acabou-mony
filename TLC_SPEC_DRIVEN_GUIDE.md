# 🎯 Guia TLC Spec-Driven Development - Acabou o Mony

## 📋 O que é TLC Spec-Driven?

**TLC Spec-Driven Development** é uma metodologia que coloca as **especificações** no centro do desenvolvimento:

1. **Spec First**: Escrever especificações antes de codificar
2. **Single Source of Truth**: Uma única fonte de verdade para requisitos
3. **Continuous Validation**: Validação contínua da conformidade
4. **Living Documentation**: Documentação que evolui com o código

---

## 📁 Estrutura Atual vs Estrutura Ideal

### ✅ Arquivos CORE (Mantenha - São Essenciais)

| Arquivo | Propósito | Status |
|---------|-----------|--------|
| **`enunciado.md`** | 🎯 Problema de negócio, contexto, user stories | ✅ ESSENCIAL |
| **`specs.md`** | 📋 Especificações técnicas detalhadas | ✅ ESSENCIAL |
| **`tasks.md`** | ✔️ Backlog organizado por sprints | ✅ ESSENCIAL |
| **`rules.md`** | 📏 Regras de desenvolvimento e padrões | ✅ ESSENCIAL |
| **`agents.md`** | 🤖 Guia de agentes e automações | ✅ RECOMENDADO |
| **`HELP.md`** | 📖 Documentação de referência Spring Boot | ✅ ÚTIL |

### ❌ Arquivos REDUNDANTES (Consolidar ou Remover)

| Arquivo | Motivo | Ação Recomendada |
|---------|--------|------------------|
| `acabou-mony-frontend/FILES_CREATED.md` | Git já rastreia arquivos criados | ❌ REMOVER |
| `acabou-mony-frontend/QUICK_START.md` | Pode ser seção do README principal | 🔄 CONSOLIDAR |
| `acabou-mony-frontend/IMPLEMENTATION_SUMMARY.md` | Deve estar em `progress_frontend.md` | 🔄 CONSOLIDAR |
| `acabou-mony-frontend/USER_FLOW_VISUAL.md` | Pode ser parte do `specs.md` | 🔄 CONSOLIDAR |
| `acabou-mony-frontend/AUTH_FLOW.md` | Pode ser parte do `specs.md` | 🔄 CONSOLIDAR |
| `acabou-mony-*/HELP.md` | Duplicados do Spring Boot | 🔄 MANTER APENAS 1 |

---

## 🏗️ Estrutura Ideal do Projeto

```
acabou-o-mony-api/
│
├── 📄 README.md                     # 📖 Visão geral do projeto
├── 📄 enunciado.md                  # ⭐ CORE: Problema de negócio
├── 📄 specs.md                      # ⭐ CORE: Especificações técnicas
├── 📄 tasks.md                      # ⭐ CORE: Backlog de tarefas
├── 📄 rules.md                      # ⭐ CORE: Regras de desenvolvimento
├── 📄 agents.md                     # 🤖 Guia de agentes
├── 📄 HELP.md                       # 📚 Referências técnicas (Spring Boot)
│
├── 📁 docs/                         # 📚 Documentação consolidada
│   ├── architecture.md              # Arquitetura do sistema
│   ├── api-contracts.md             # Contratos de API
│   ├── deployment.md                # Guia de deploy
│   ├── frontend-guide.md            # Guia do frontend (consolidado)
│   └── auth-flow.md                 # Fluxo de autenticação
│
├── 📄 docker-compose.yml            # 🐳 Infraestrutura
├── 📄 data.sql                      # 🗄️ Schema do banco
├── 📄 pom.xml                       # 🏗️ Parent POM
│
├── 📁 nginx/                        # 🌐 Load balancer
│   └── nginx.conf
│
├── 📁 acabou-mony-gateway/          # 🚪 API Gateway (8088)
│   ├── src/
│   ├── pom.xml
│   └── progress_gateway.md          # ✅ Progresso específico
│
├── 📁 acabou-mony-auth/             # 🔐 Autenticação (8081)
│   ├── src/
│   ├── pom.xml
│   └── progress_auth.md
│
├── 📁 acabou-mony-account/          # 💰 Contas (8082)
│   ├── src/
│   ├── pom.xml
│   └── progress_account.md
│
├── 📁 acabou-mony-transaction/      # 💳 Transações (8083)
│   ├── src/
│   ├── pom.xml
│   └── progress_transaction.md
│
├── 📁 acabou-mony-card/             # 💳 Cartões (8084)
│   ├── src/
│   ├── pom.xml
│   └── progress_card.md
│
├── 📁 acabou-mony-auditing/         # 📊 Auditoria (8085)
│   ├── src/
│   ├── pom.xml
│   └── progress_auditing.md
│
├── 📁 acabou-mony-notificacao/      # 📧 Notificações (8086)
│   ├── src/
│   ├── pom.xml
│   └── progress_notificacao.md
│
└── 📁 acabou-mony-frontend/         # 🖥️ Frontend (5173)
    ├── src/
    ├── package.json
    ├── README.md                    # Guia específico do frontend
    └── progress_frontend.md         # Progresso do frontend
```

---

## 🔄 Workflow TLC Spec-Driven

### 1️⃣ Fase: Definição (Spec First)

```
enunciado.md → specs.md → tasks.md
```

**Exemplo prático:**

1. **Leia `enunciado.md`** para entender o problema
   ```markdown
   Story 1: Transaction Processing
   - Processar transações em < 1 segundo
   - Receber confirmação (sucesso/falha)
   ```

2. **Detalhe em `specs.md`**
   ```markdown
   ## Story 1: Transaction Processing
   
   ### API Contract
   POST /api/transactions
   {
     "contaOrigemId": 1,
     "contaDestinoId": 2,
     "valor": 100.00
   }
   
   ### Performance Requirements
   - Latency: < 1 segundo (p95)
   - Throughput: 1,000 req/s
   ```

3. **Quebre em `tasks.md`**
   ```markdown
   ## Sprint 4 – Pagamentos
   - [ ] Criar TransacaoController
   - [ ] Implementar validação de saldo
   - [ ] Testes de performance (< 1s)
   ```

### 2️⃣ Fase: Implementação

4. **Consulte `rules.md`** antes de codificar
   ```java
   // ✅ CORRETO (seguindo rules.md)
   @Column(precision = 15, scale = 2)
   private BigDecimal valor;
   
   // ❌ ERRADO
   private double valor; // Nunca use float/double!
   ```

5. **Implemente seguindo as specs**

### 3️⃣ Fase: Validação

6. **Valide contra `specs.md`**
   ```bash
   mvn test -Dtest=TransacaoPerformanceTest
   # Verificar se atende < 1 segundo
   ```

7. **Atualize `progress_*.md`**
   ```markdown
   ## ✅ Completed Features
   - [x] POST /api/transactions endpoint
   - [x] Performance: 850ms average ✅
   
   ## 📊 Performance Metrics
   - Average: 850ms ✅ (< 1s requirement)
   - p95: 980ms ✅
   ```

---

## 📝 Regras dos Arquivos `progress_*.md`

### Estrutura Obrigatória (Máximo 200 linhas)

```markdown
# Progress: [Nome do Módulo]

## ✅ Current Status
**[STATUS]** - [Descrição breve]

## 📊 Module Overview
- **Port**: 8083
- **Purpose**: Processar transações
- **Status**: ✅ COMPLETE / ⚠️ IN PROGRESS / ❌ NOT STARTED
- **Developer**: Dev 2

## ✅ Completed Features
- [x] Feature 1
- [x] Feature 2

## 📊 Performance Metrics
- Metric 1: Value ✅/⚠️/❌
- Metric 2: Value ✅/⚠️/❌

## ⚠️ Known Limitations
- Limitation 1
- Limitation 2

## 🔄 Next Steps
1. Next task 1
2. Next task 2

## 🔗 Dependencies
- **Depends on**: account-service, rabbitmq
- **Consumed by**: gateway, frontend

**Last Updated**: 2024-01-15
```

---

## 🎯 Checklist de Conformidade

Antes de considerar uma feature completa:

### ✅ Especificações
- [ ] Feature documentada em `specs.md`
- [ ] Acceptance c[ ] Contratos de API definidositeria claros
- n
### ✅ Implementação
- [ ] Código segue `rules.md`
- [ ] Testes unitários (> 80% coverage)
- [ ] Testes de integração
- [ ] Performance validada

### ✅ Documentação
- [ ] `progress_*.md` atualizado
- [ ] `tasks.md` marcado como concluído
- [ ] Comentários de código
- [ ] API documentada (Swagger)

### ✅ Qualidade
- [ ] Code review realizado
- [ ] Sem warnings de segurança
- [ ] Logs adequados
- [ ] Error handling completo

---

## 🚀 Ações Imediatas para Organizar

### 1. Consolidar Documentação do Frontend

```bash
# Mover conteúdo para docs/
acabou-mony-frontend/AUTH_FLOW.md → docs/auth-flow.md
acabou-mony-frontend/USER_FLOW_VISUAL.md → docs/user-flow.md
acabou-mony-frontend/QUICK_START.md → Seção do README.md
acabou-mony-frontend/IMPLEMENTATION_SUMMARY.md → progress_frontend.md
```

### 2. Remover Arquivos Redundantes

```bash
# Deletar arquivos desnecessários
acabou-mony-frontend/FILES_CREATED.md (Git já rastreia)
acabou-mony-*/HELP.md (exceto o principal)
```

### 3. Criar Arquivos `progress_*.md` Faltantes

```bash
# Criar para cada módulo que não tem
progress_gateway.md
progress_auth.md
progress_account.md
progress_transaction.md
progress_card.md
progress_auditing.md
progress_notificacao.md
progress_frontend.md
```

### 4. Criar Pasta `docs/` Consolidada

```bash
docs/
├── architecture.md       # Visão geral da arquitetura
├── api-contracts.md      # Todos os contratos de API
├── deployment.md         # Guia de deploy
├── frontend-guide.md     # Guia consolidado do frontend
└── auth-flow.md          # Fluxo de autenticação detalhado
```

---

## 📚 Resumo: O que Fazer Agora?

### ✅ **MANTER** (Essenciais)
1. `enunciado.md` - Problema de negócio
2. `specs.md` - Especificações técnicas
3. `tasks.md` - Backlog
4. `rules.md` - Padrões
5. `agents.md` - Automações
6. `HELP.md` - Referência Spring Boot

### 🔄 **CONSOLIDAR**
1. Criar `docs/` com documentação organizada
2. Criar `progress_*.md` para cada módulo
3. Mover conteúdo do frontend para locais apropriados

### ❌ **REMOVER**
1. `FILES_CREATED.md` (redundante)
2. `HELP.md` duplicados em cada módulo
3. Arquivos de documentação duplicados

---

## 🎓 Princípios Fundamentais

1. **Uma Fonte de Verdade**: `specs.md` é a referência
2. **Documentação Viva**: `progress_*.md` sempre atualizado
3. **Spec First**: Especificar antes de implementar
4. **Validação Contínua**: Testar contra specs
5. **Máximo 200 linhas**: Arquivos `progress_*.md` concisos

---

**Próximo passo**: Vou criar os arquivos de reorganização! 🚀
