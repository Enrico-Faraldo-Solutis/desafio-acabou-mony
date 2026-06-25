# 🧪 Contract Testing Setup - Acabou o Mony

> **Future implementation guide** for Consumer-Driven Contract Testing

## 📋 Overview

Contract testing will ensure API compatibility between microservices by validating:
- **Provider**: Service provides what it promises (API contract)
- **Consumer**: Service consumes APIs correctly

## 🛠️ Recommended Tools

- **Spring Cloud Contract**: For Spring Boot services
- **Pact**: Alternative consumer-driven contract testing
- **Postman/Newman**: For API contract validation

## 📝 Implementation Plan(Sprint 9)
- [ ] Add Spring Cloud Contract dependencies
- [ ] Configure Maven plugin
- [ ] Create base test classes

### Phase 2: Write Contracts (Sprint 

### Phase 1: Setup 10)
- [ ] Auth Service contracts
- [ ] Account Service contracts
- [ ] Transaction Service contracts
- [ ] Card Service contracts

### Phase 3: Consumer Tests (Sprint 11)
- [ ] Transaction → Account integration
- [ ] Card → Account integration
- [ ] Gateway → All services

### Phase 4: CI/CD Integration (Sprint 12)
- [ ] Add contract tests to GitHub Actions
- [ ] Publish stubs to artifact repository
- [ ] Block merges on contract failures

## 📚 Resources

- [Spring Cloud Contract Docs](https://spring.io/projects/spring-cloud-contract)
- [Pact Documentation](https://docs.pact.io/)
- [API Contracts Reference](./api-contracts.md)

## alls have contra🎯 Success Criteria

- ✅ All inter-service ccts
- ✅ Contract tests run in CI/CD
- ✅ Breaking changes detected before deployment
- ✅ 100% contract coverage for critical paths

---

**Status**: 📋 Planned  
**Priority**: Medium  
**Estimated Effort**: 3 sprints  
**Last Updated**: 2024-01-15
