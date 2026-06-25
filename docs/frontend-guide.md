# 🖥️ Frontend Guide - Acabou o Mony

> **Consolidado de**: `QUICK_START.md`, `IMPLEMENTATION_SUMMARY.md`, `AUTH_FLOW.md`, `USER_FLOW_VISUAL.md`

## 📋 Índice
1. [Quick Start](#quick-start)
2. [Arquitetura](#arquitetura)
3. [Fluxo de Autenticação](#fluxo-de-autenticação)
4. [Componentes](#componentes)
5. [Desenvolvimento](#desenvolvimento)

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js v18+
- npm ou yarn
- Backend rodando (Gateway port 8088)

### Instalação e Execução

```bash
cd acabou-mony-frontend
npm install
npm run dev
```

Acesse: `http://localhost:5173`

### Testando o Fluxo Completo

1. **Login** (`/login`)
   - Email: `user@example.com`
   - Password: `password123`

2. **2FA** (`/verify-2fa`)
   - Código: Verifique logs do backend ou email

3. **Dashboard** (`/dashboard`)
   - Página protegida com JWT token

---

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis
│   └── ProtectedRoute.jsx
├── context/            # Estado global
│   └── AuthContext.jsx
├── pages/              # Páginas
│   ├── LoginPage.jsx
│   ├── Verify2FAPage.jsx
│   └── DashboardPage.jsx
├── services/           # API services
│   └── api.js
└── App.jsx            # Rotas principais
```

### Tecnologias

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | 19.2.6 | UI Framework |
| React Router | 6.x | Roteamento |
| Axios | 1.18.0 | HTTP Client |
| Vite | Latest | Build Tool |

---

## 🔐 Fluxo de Autenticação

### Diagrama Visual

```
┌─────────────┐
│   /login    │ ← Usuário acessa
└──────┬──────┘
       │ 1. Envia email/password
       ▼
┌─────────────────────────────┐
│ POST /api/acabou-mony-auth/ │
│         login               │
└──────┬──────────────────────┘
       │ 2. Backend retorna usuarioId
       ▼
┌─────────────┐
│ /verify-2fa │ ← Redirecionado
└──────┬──────┘
       │ 3. Envia código 2FA
       ▼
┌─────────────────────────────┐
│ POST /api/acabou-mony-auth/ │
│       verify-2fa            │
└──────┬──────────────────────┘
       │ 4. Backend retorna JWT token
       ▼
┌─────────────┐
│ /dashboard  │ ← Autenticado
└─────────────┘
```

### Detalhamento Técnico

#### 1. Login Inicial

**Request:**
```javascript
POST http://localhost:8088/api/acabou-mony-auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "senha": "password123"
}
```

**Response (Success):**
```json
{
  "usuarioId": 1,
  "message": "2FA code sent"
}
```

**Frontend Action:**
```javascript
// AuthContext.jsx
const login = async (email, senha) => {
  const response = await authService.login({ email, senha });
  navigate('/verify-2fa', { state: { usuarioId: response.usuarioId } });
};
```

#### 2. Verificação 2FA

**Request:**
```javascript
POST http://localhost:8088/api/acabou-mony-auth/verify-2fa
Content-Type: application/json

{
  "usuarioId": 1,
  "codigo": "123456"
}
```

**Response (Success):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "user@example.com"
  }
}
```

**Frontend Action:**
```javascript
// AuthContext.jsx
const verify2FA = async (usuarioId, codigo) => {
  const response = await authService.verify2FA({ usuarioId, codigo });
  setToken(response.token);
  setUser(response.usuario);
  localStorage.setItem('token', response.token);
  localStorage.setItem('user', JSON.stringify(response.usuario));
  navigate('/dashboard');
};
```

#### 3. Requisições Autenticadas

**Axios Interceptor:**
```javascript
// services/api.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Exemplo de Request:**
```javascript
GET http://localhost:8088/api/acabou-mony-transaction/transactions
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🧩 Componentes

### 1. AuthContext

**Responsabilidade**: Gerenciar estado global de autenticação

**Estado:**
```javascript
{
  user: { id, nome, email },
  token: "jwt-token",
  loading: false
}
```

**Métodos:**
- `login(email, senha)` - Login inicial
- `verify2FA(usuarioId, codigo)` - Verificação 2FA
- `logout()` - Limpar sessão

**Uso:**
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, token, login, logout } = useAuth();
  
  return (
    <div>
      <p>Bem-vindo, {user?.nome}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### 2. ProtectedRoute

**Responsabilidade**: Proteger rotas que requerem autenticação

**Lógica:**
```jsx
function ProtectedRoute({ children }) {
  const { token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
```

**Uso:**
```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

### 3. LoginPage

**Features:**
- Formulário email/password
- Validação de campos
- Loading state
- Error handling

**Estados:**
```javascript
const [email, setEmail] = useState('');
const [senha, setSenha] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

### 4. Verify2FAPage

**Features:**
- Input de 6 dígitos
- Validação de código
- Resend code (TODO)
- Timer de expiração (TODO)

**Estados:**
```javascript
const [codigo, setCodigo] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

### 5. DashboardPage

**Features:**
- Exibir informações do usuário
- Cards de features (transações, cartões, etc.)
- Logout button

---

## 💻 Desenvolvimento

### Adicionando Nova Página

1. **Criar componente:**
```jsx
// src/pages/TransactionsPage.jsx
import React from 'react';
import './TransactionsPage.css';

function TransactionsPage() {
  return (
    <div className="transactions-page">
      <h1>Minhas Transações</h1>
      {/* Conteúdo */}
    </div>
  );
}

export default TransactionsPage;
```

2. **Adicionar rota:**
```jsx
// src/App.jsx
import TransactionsPage from './pages/TransactionsPage';

<Route
  path="/transactions"
  element={
    <ProtectedRoute>
      <TransactionsPage />
    </ProtectedRoute>
  }
/>
```

### Adicionando Nova API Call

1. **Criar método no service:**
```javascript
// src/services/api.js
export const transactionService = {
  getAll: () => api.get('/acabou-mony-transaction/transactions'),
  getById: (id) => api.get(`/acabou-mony-transaction/transactions/${id}`),
  create: (data) => api.post('/acabou-mony-transaction/transactions', data),
};
```

2. **Usar no componente:**
```jsx
import { transactionService } from '../services/api';

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await transactionService.getAll();
        setTransactions(response.data);
      } catch (error) {
        console.error('Erro ao buscar transações:', error);
      }
    };
    
    fetchTransactions();
  }, []);
  
  return (
    <div>
      {transactions.map(tx => (
        <div key={tx.id}>{tx.valor}</div>
      ))}
    </div>
  );
}
```

### Estilização

**Padrão de cores:**
```css
:root {
  --primary: #667eea;
  --secondary: #764ba2;
  --background: #f7fafc;
  --text: #1a202c;
  --error: #c53030;
  --success: #38a169;
}
```

**Exemplo de card:**
```css
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-4px);
}
```

### Tratamento de Erros

**Padrão:**
```javascript
try {
  const response = await api.get('/endpoint');
  // Success
} catch (error) {
  if (error.response) {
    // Backend retornou erro (4xx, 5xx)
    setError(error.response.data.message || 'Erro ao processar requisição');
  } else if (error.request) {
    // Requisição foi feita mas sem resposta
    setError('Servidor não respondeu. Tente novamente.');
  } else {
    // Erro ao configurar requisição
    setError('Erro inesperado. Tente novamente.');
  }
}
```

---

## 🧪 Testes

### Testando Autenticação Manualmente

```bash
# 1. Login
curl -X POST http://localhost:8088/api/acabou-mony-auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","senha":"password123"}'

# Response: {"usuarioId":1,"message":"2FA code sent"}

# 2. Verificar 2FA (código do backend logs)
curl -X POST http://localhost:8088/api/acabou-mony-auth/verify-2fa \
  -H "Content-Type: application/json" \
  -d '{"usuarioId":1,"codigo":"123456"}'

# Response: {"token":"eyJhbG...","usuario":{...}}

# 3. Usar token em requisição autenticada
curl -X GET http://localhost:8088/api/acabou-mony-transaction/transactions \
  -H "Authorization: Bearer eyJhbG..."
```

---

## 🐛 Troubleshooting

### CORS Errors

**Problema**: `Access-Control-Allow-Origin` error

**Solução**: Verificar configuração do Gateway
```java
// GatewayConfig.java
@Bean
public CorsWebFilter corsWebFilter() {
    CorsConfiguration config = new CorsConfiguration();
    config.addAllowedOrigin("http://localhost:5173");
    config.addAllowedMethod("*");
    config.addAllowedHeader("*");
    config.setAllowCredentials(true);
    // ...
}
```

### Token Não Funciona

**Problema**: 403 Forbidden em requisições autenticadas

**Solução**:
1. Verificar se token está no localStorage
2. Verificar se interceptor está configurado
3. Verificar formato: `Bearer <token>`
4. Verificar expiração do token

### 2FA Code Não Recebido

**Problema**: Código 2FA não aparece

**Solução**:
1. Verificar logs do backend (código é impresso no console)
2. Verificar configuração de email (se aplicável)
3. Verificar se `TwoFactorAuthService` está funcionando

---

## 📚 Próximos Passos

### Features Planejadas

- [ ] **Transactions Page**: Listar e filtrar transações
- [ ] **Cards Page**: Gerenciar cartões
- [ ] **Profile Page**: Editar perfil do usuário
- [ ] **Notifications**: Centro de notificações
- [ ] **Live Commerce**: Integração com plataformas de live
- [ ] **Dark Mode**: Tema escuro
- [ ] **i18n**: Suporte multi-idioma

### Melhorias Técnicas

- [ ] Token refresh automático
- [ ] Error boundaries
- [ ] Code splitting
- [ ] Lazy loading de rotas
- [ ] Unit tests (Jest + React Testing Library)
- [ ] E2E tests (Cypress)
- [ ] Storybook para componentes
- [ ] Performance monitoring

---

## 📊 Métricas de Qualidade

### Cobertura de Código
- **Target**: 80%
- **Atual**: 0% (testes não implementados)

### Performance
- **Lighthouse Score**: 90+ (target)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s

### Acessibilidade
- **WCAG**: AA compliance (target)
- **Keyboard navigation**: Implementar
- **Screen reader**: Adicionar ARIA labels

---

**Última atualização**: 2024-01-15  
**Mantido por**: Dev Team
