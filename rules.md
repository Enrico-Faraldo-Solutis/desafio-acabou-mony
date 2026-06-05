# Development Rules & Standards for Acabou-Mony Project

## 3. Transaction Module Specific Rules

### 3.1 Monetary Value Handling
**RULE: All monetary values MUST use `java.math.BigDecimal` (never float/double).**

- BigDecimal provides precision for financial calculations
- Always use `new BigDecimal("string")` constructor (not `valueOf()` for user input)
- Use `compareTo()` for comparisons, not `equals()`
- Set precision in `@Column(precision = 15, scale = 2)` for database columns
- Example: `@Column(nullable = false, precision = 15, scale = 2) private BigDecimal valor;`

### 3.2 Transaction State Management
**RULE: Transaction status MUST follow the enum state machine: PENDENTE → CONCLUIDA/FALHA**

- Initial status: `StatusTransacao.PENDENTE` (set in `@PrePersist`)
- Success path: PENDENTE → CONCLUIDA
- Failure path: PENDENTE → FALHA
- No direct transitions between CONCLUIDA and FALHA
- Status updates MUST be persisted immediately after state change
- Use `@Enumerated(EnumType.STRING)` for database storage

### 3.3 Database Transactions
**RULE: All Service methods that modify state MUST be annotated with `@Transactional`.**

- `@Transactional` on service methods that create/update/delete entities
- Use `@Transactional(readOnly = true)` for query-only methods
- Rollback on checked exceptions: `@Transactional(rollbackFor = Exception.class)`
- Propagation: `REQUIRED` (default) for most operations
- Isolation: `READ_COMMITTED` (default) unless specified otherwise

### 3.4 RabbitMQ Messaging Pattern
**RULE: RabbitMQ messaging MUST follow non-blocking fire-and-forget pattern.**

- Messages sent via `RabbitTemplate.convertAndSend()` (non-blocking)
- Wrap messaging in try-catch to prevent transaction rollback
- Log messaging errors but do NOT throw exceptions
- Use `Jackson2JsonMessageConverter` for serialization
- Register `JavaTimeModule` in ObjectMapper for LocalDateTime support
- Example pattern:
  ```java
  try {
      rabbitTemplate.convertAndSend("exchange", "routingKey", dto);
      log.info("Message sent successfully");
  } catch (Exception e) {
      log.error("Failed to send message: {}", e.getMessage());
      // Do NOT rethrow - transaction should not rollback
  }
  ```

### 3.5 Inter-service Communication
**RULE: HTTP calls to other services MUST include timeout and error handling.**

- Use `RestTemplate` or `WebClient` for HTTP calls
- Set connection timeout: 5 seconds (configurable)
- Set read timeout: 10 seconds (configurable)
- Implement retry logic with exponential backoff for transient failures
- Catch `RestClientException` and convert to domain exceptions
- Log all inter-service calls with request/response details
- Example:
  ```java
  try {
      ContaEspelhoDto conta = accountClient.getBalance(contaId);
      if (conta == null) {
          throw new IllegalArgumentException("Conta não encontrada");
      }
  } catch (RestClientException e) {
      log.error("Failed to fetch account balance: {}", e.getMessage()ceptio);
      throw new RuntimeExn("Account service unavailable", e);
  }
  ```

### 3.6 Input Validation
**RULE: All DTOs MUST have validation annotations for required fields and constraints.**

- Use `@NotNull` for mandatory fields
- Use `@DecimalMin` for monetary values (minimum 0.01)
- Use `@Positive` for positive-only values
- Use `@Size` for string length constraints
- Use `@Email` for email fields
- Validation errors return HTTP 400 (Bad Request)
- Example:
  ```java
  @NotNull(message = "Valor é obrigatório")
  @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
  private BigDecimal valor;
  ```

### 3.7 Error Handling
**RULE: Service methods MUST throw domain-specific exceptions, controllers MUST catch and map to HTTP responses.**

- Service layer: Throw custom exceptions (e.g., `TransacaoNaoEncontradaException`)
- Controller layer: Catch exceptions and return appropriate HTTP status codes
- HTTP 400: Validation errors, insufficient balance, invalid input
- HTTP 404: Resource not found
- HTTP 500: Unexpected server errors
- Always log errors with context (IDs, amounts, user info)

### 3.8 Logging
**RULE: All Service methods MUST log entry, exit, and error conditions.**

- Use `@Slf4j` annotation from Lombok
- Log level INFO for business operations (transaction start/completion)
- Log level WARN for validation failures (insufficient balance)
- Log level ERROR for exceptions with full stack trace
- Include relevant context: IDs, amounts, account numbers
- Example:
  ```java
  log.info("Iniciando processamento de transação: origem={}, destino={}, valor={}",
          dto.getContaOrigemId(), dto.getContaDestinoId(), dto.getValor());
  ```

---

## 4. Progress Tracking Rules

### 4.1 Progress File Updates
**RULE: Once a task is completed, the agent MUST update the module's progress file.**

- Update frequency: After each completed sprint task
- File location: `progress_{module}.md` (e.g., `progress_transaction.md`)
- Maximum file size: **200 lines** (enforced)
- Format: Markdown with clear sections and status indicators

### 4.2 Progress File Structure
Each progress file MUST contain:

1. **Current Status**: One-line summary (e.g., "IMPLEMENTATION COMPLETE ✅")
2. **Module Overview**: Port, purpose, status, assigned developer
3. **Completed Features**: Bulleted list with ✅ checkmarks
4. **Performance Metrics**: Relevant KPIs (e.g., <1 second transaction processing)
5. **Known Limitations**: Unimplemented features or constraints
6. **Next Steps**: Prioritized list of future work
7. **Dependencies**: Services this module depends on / is consumed by
8. **Last Updated**: Date of most recent update

### 4.3 Progress File Line Limit
- Maximum 200 lines per progress file (HARD LIMIT)
- Use concise bullet points, not paragraphs
- Abbreviate feature descriptions to 1-2 lines
- Remove completed "Next Steps" items
- Archive old progress in separate CHANGELOG if needed

### 4.4 Status Indicators
Use these indicators consistently:
- ✅ Completed / Working
- ⚠️ In Progress / Partial / Known Issue
- ❌ Not Started / Blocked
- 🔄 Needs Review / Refactoring

---

## 5. Code Style & Conventions

### 5.1 Naming Conventions
- Classes: PascalCase (e.g., `TransacaoService`, `ContaEspelhoDto`)
- Methods: camelCase (e.g., `processarTransacao`, `obterTransacao`)
- Constants: UPPER_SNAKE_CASE (e.g., `QUEUE_NAME`, `ROUTING_KEY`)
- Variables: camelCase (e.g., `contaOrigemId`, `novoSaldo`)
- Packages: lowercase.with.dots (e.g., `com.example.acabou_mony_transaction.service`)

### 5.2 Lombok Usage
- Use `@Data` for entity classes (generates getters, setters, equals, hashCode, toString)
- Use `@Builder` for DTOs and entities (fluent object construction)
- Use `@Slf4j` for logging (provides `log` variable)
- Use `@NoArgsConstructor`, `@AllArgsConstructor` for constructors
- Use `@Component`, `@Service`, `@Repository` instead of `@Bean` where possible

### 5.3 Spring Annotations
- Use constructor injection (not field injection with `@Autowired`)
- Use `@Transactional` on service methods that modify state
- Use `@Validated` on controller classes with `@Valid` on method parameters
- Use `@RestController` and `@RequestMapping` for REST endpoints
- Use `@Entity`, `@Table`, `@Column` for JPA entities

### 5.4 Documentation
- Add JavaDoc comments to public methods
- Include parameter descriptions and return value documentation
- Add inline comments for complex business logic
- Keep comments up-to-date with code changes

---

## 6. Java & Spring Boot Standards

### 6.1 Java Version
- **Java 21** required for all modules
- Use modern Java features: records, sealed classes, pattern matching where appropriate
- Avoid deprecated APIs

### 6.2 Spring Boot Versions
- Versions vary by module (3.2.5, 3.5.14, 4.0.6)
- Use Spring Data JPA for persistence
- Use Spring Web for REST controllers
- Use Spring AMQP for RabbitMQ integration
- Use Springdoc OpenAPI for API documentation

### 6.3 Dependencies
- Use Maven for dependency management
- Keep dependency versions in sync across modules
- Use `spring-boot-starter-*` for Spring Boot starters

## 8. Performance & Scalability Standards

### 8.1 Transaction Processing (Story 1)
- **Requirement**: Process transactions in < 1 second
- Includes: Balance validation, database persistence, RabbitMQ publishing
- Measured: End-to-end from API request to response
- Monitoring: Add metrics for transaction latency percentiles (p50, p95, p99)

### 8.2 Scalability (Story 2)
- System must scale horizontally (multiple instances)
- RabbitMQ enables async processing and decoupling
- Database connection pooling: HikariCP (default in Spring Boot)
- Load balancing: NGINX in front of API Gateway
- No single points of failure

### 8.3 Database Performance
- Use JPA query methods (derived queries) for simple lookups
- Use `@Query` annotations for complex queries
- Add database indexes on frequently queried columns
- Monitor slow query logs
- Use pagination for large result sets

---

## 9. Security Standards (Story 3)

### 9.1 Authentication & Authorization
- JWT tokens issued by auth service
- API Gateway validates JWT before routing
- Each service receives validated user context
- No hardcoded credentials in code (use environment variables)

### 9.2 Two-Factor Authentication (2FA)
- Implemented in `acabou-mony-auth` module
- Required for sensitive operations (large transfers, card blocks)
- OTP codes sent via email/SMS
- Timeout: 5 minutes for OTP validity

### 9.3 Data Protection
- Sensitive data (passwords, OTP codes) hashed with bcrypt
- PII encrypted at rest (database level)
- Audit logs for all critical operations
- No sensitive data in logs (mask account numbers, amounts)

---

## 10. Integration Standards

### 10.1 API Gateway Integration
- All external requests routed through API Gateway (port 8088)
- Gateway enforces JWT authentication
- Gateway routes to backend services based on path prefix
- Example: `/api/transactions/*` → `http://transaction-service:8083/*`

### 10.2 RabbitMQ Integration
- Message broker for async communication
- Exchange: `cliente.exchange` (DirectExchange)
- Queue: `cliente.cadastro.queue`
- Routing key: `cliente.cadastro`
- Consumer: `acabou-mony-notificacao` service
- Message format: JSON with Jackson serialization

### 10.3 Database Integration
- Shared MySQL database: `db_acabou_mony`
- Schema: Defined in `data.sql`
- Connection pooling: HikariCP with default settings
- Transactions: Managed by Spring `@Transactional`

---

## 11. Documentation Standards

### 11.1 API Documentation
- Use Springdoc OpenAPI (`springdoc-openapi-starter-webmvc-ui`)
- Swagger UI available at: `http://localhost:{port}/swagger-ui.html`
- Document all endpoints with descriptions and examples
- Include request/response schemas
- Document error responses (400, 404, 500)

### 11.2 README Files
- Each module should have a `README.md` with:
  - Module purpose and responsibilities
  - API endpoints summary
  - Configuration requirements
  - Running instructions

### 11.3 Architecture Documentation
- Keep `AGENTS.md` updated with module responsibilities
- Update `enunciado.md` with new user stories
- Maintain `progress_*.md` files for each module

---

## 12. Enforcement & Review

### 12.1 Code Review Checklist
- [ ] No hardcoded credentials or secrets
- [ ] Logging includes sufficient context
- [ ] Error handling is comprehensive
- [ ] Progress file updated
- [ ] Documentation updated
- [ ] Commit messages follow standards

### 12.2 Violations & Remediation
- Rule violations must be fixed before merge
- Exceptions require explicit approval from tech lead
- Document exceptions in code comments with justification
- Track exceptions in project retrospectives

---

**Last Updated**: 2024
**Maintained By**: Development Team
**Review Frequency**: Quarterly