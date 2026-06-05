# Agents.md – Guia de Agentes para o Projeto "Acabou o Mony"

## 1. Tipos de Agentes Disponíveis

| Tipo de Agente | Descrição | Ferramentas Utilizadas | Quando Usar |
|----------------|-----------|------------------------|-------------|
| **explore** | Busca rápida de arquivos, padrões de código e navegação no código‑base. | `bash`, `grep`, `glob` | - Localizar classes, endpoints ou padrões de configuração.<br>- Entender a estrutura de pastas.<br>- Identificar pontos de contato entre serviços. |
| **general** | Executa tarefas multipasso complexas (build, test, deploy, CI/CD). | `bash`, `mvn`, `docker`, `git`, `helm` (se houver) | - Compilar todos os micro‑serviços.<br>- Executar testes de carga e performance.<br>- Deploy automático em ambientes de teste ou produção.<br>- Gerar artefatos de documentação. |
| **customize‑opencode** | Modifica apenas arquivos de configuração própria do opencode (ex.: `opencode.json`, diretórios `.opencode/`). | `edit`, `read` | - Ajustes de propriedade, limites ou flags de configuração.<br>- Criação/edição de arquivos de permissão ou de template. |
| **security‑best‑practices** (skill interna) | Aplica normas de segurança específicas ao código (HTTPS, token handling, encriptação). | Dependente da skill carregada | - Revisão de endpoints sensíveis.<br>- Garantia de headers de segurança.<br>- Implementação de 2FA e validação de JWT. |
| **docker‑compose‑quickstart** (skill interna) | Fornece scripts prontos para levantar infra‑estrutura (MySQL, RabbitMQ, NGINX). | `docker-compose` | - Iniciar ambiente local para desenvolvimento ou testes.<br>- Validar integração entre serviços antes do CI. |

## 2. Como Utilizar Cada Tipo

### explore
- **Comando típico:** `explore --description "Find all transaction‑related controllers"`  
- **Resultado esperado:** Lista de caminhos de arquivos e linhas correspondentes.  
- **Dica:** Use filtros `--include "*.java"` ou `--exclude "test"` para refinar.

### general
- **Exemplo de uso:**  
  1. `general --prompt "Compile all modules and run integration tests"`  
  2. O agente executará `mvn clean install` em cada sub‑pasta e disparará os testes definidos no `pom.xml`.  
- **Resultado esperado:** Build bem‑sucedido ou relatório de falhas.

### customize‑opencode
- **Exemplo:**  
  - `customize-opencode --name "opencode.json" --oldString "oldValue" --newString "newValue" --replaceAll true`  
- **Resultado esperado:** Atualização de todas as ocorrências do valor especificado no arquivo de configuração.

### security‑best‑practices
- **Exemplo:**  
  - Carregar a skill e solicitar revisão de um endpoint:  
    ```
    skill --name security-best-practices
    Question: "Revisar o endpoint /api/transactions para garantir uso de HTTPS e validação de token"
    ```  
- **Resultado esperado:** Relatório com sugestões deHeaders, validação de scopes e recomendações de criptografia.

### docker‑compose‑quickstart
- **Exemplo:**  
  - `skill --name docker-compose-quickstart --command "docker-compose up -d"`  
- **Resultado esperado:** Serviços (MySQL, RabbitMQ, NGINX) rodando em background, prontos para uso.

## 3. Fluxo Recomendado de Trabalho

1. **Onboarding** – Use `explore` para mapear a estrutura de microserviços.  
2. **Implementação de Features** –  
   - Descrição da tarefa no `tasks.md` → Crie um agente `general` para executar o build.  
   - Use `explore` para localizar arquivos modificados antes de editar.  
   - Edite com `edit` ou `write` conforme necessário.  
3. **Testes & Qualidade** – Rode um agente `general` com etapas de teste, cobertura e análise estática.  
4. **Deploy** – Utilize um agente `general` que invoque scripts Docker/Kubernetes ou GitHub Actions.  
5. **Ajustes de Configuração** – Quando precisar mudar propriedades de ambiente, recorra a `customize‑opencode` ou ao skill `docker‑compose‑quickstart`.

## 4. Referências de Comandos (Exemplos)

```bash
# Explorar arquivos de configuração do gateway
explore --pattern "gateway/**/*.java"

# Compilar todos os módulos
general --prompt "Run Maven install in each service"

# Subir infraestrutura local
skill --name docker-compose-quickstart --command "docker-compose up -d"

# Revisar segurança de um endpoint
skill --name security-best-practices --question "Validar uso de HTTPS no endpoint /api/transactions"
```

---  

*Este documento serves as the central reference for selecting and invoking the appropriate agent for any given task within the "Acabou o Mony" project.*