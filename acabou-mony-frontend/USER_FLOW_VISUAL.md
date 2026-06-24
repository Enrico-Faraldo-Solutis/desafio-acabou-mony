# 🎨 Visual User Flow - Acabou o Mony

## Complete Authentication Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER OPENS APPLICATION                       │
│                    http://localhost:5173                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  Not Logged In?│
                    └────────┬───────┘
                             │ YES
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      📱 LOGIN PAGE (/login)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ╔════════════════════════════════════════════════════╗        │
│   ║          🎯 Acabou o Mony                          ║        │
│   ║          Faça login para continuar                 ║        │
│   ╠════════════════════════════════════════════════════╣        │
│   ║                                                    ║        │
│   ║  Email:                                            ║        │
│   ║  ┌──────────────────────────────────────────────┐ ║        │
│   ║  │ seu@email.com                                │ ║        │
│   ║  └──────────────────────────────────────────────┘ ║        │
│   ║                                                    ║        │
│   ║  Senha:                                            ║        │
│   ║  ┌──────────────────────────────────────────────┐ ║        │
│   ║  │ ••••••••                                     │ ║        │
│   ║  └──────────────────────────────────────────────┘ ║        │
│   ║                                                    ║        │
│   ║         ┌──────────────────────────┐              ║        │
│   ║         │       ENTRAR             │              ║        │
│   ║         └──────────────────────────┘              ║        │
│   ║                                                    ║        │
│   ║  Primeira vez aqui? Criar conta                   ║        │
│   ╚════════════════════════════════════════════════════╝        │
│                                            │
└────────────────────────────┬──────────                      ──────────────────────────┘
                             │
                             │ User clicks "ENTRAR"
                             ▼
                    ┌────────────────────┐
                    │ POST /login        │
                    │ {email, senha}     │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │ Backend Response:  │
                    │ {usuarioId,        │
                    │  mensagem}         │
                    └─────────┬──────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  🔐 2FA VERIFICATION PAGE                        │
│                     (/verify-2fa)                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ╔════════════════════════════════════════════════════╗        │
│   ║              🔐                                     ║        │
│   ║     Verificação em Duas Etapas                     ║        │
│   ║     Digite o código enviado para seu email         ║        │
│   ╠════════════════════════════════════════════════════╣        │
│   ║                                                    ║        │
│   ║  Código de Verificação:                            ║        │
│   ║  ┌──────────────────────────────────────────────┐ ║        │
│   ║  │           1 2 3 4 5 6                        │ ║        │
│   ║  └──────────────────────────────────────────────┘ ║        │
│   ║                                                    ║        │
│   ║         ┌──────────────────────────┐              ║        │
│   ║         │      VERIFICAR           │              ║        │
│   ║         └──────────────────────────┘              ║        │
│   ║                                                    ║        │
│   ║  Não recebeu o código?                            ║        │
│   ║  Reenviar código | Voltar ao login                ║        │
│   ╚════════════════════════════════════════════════════╝        │
│                                                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ User enters code
                             ▼
                    ┌────────────────────┐
                    │ POST /verify-2fa   │
                    │ {usuarioId, codigo}│
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │ Backend Response:  │
                    │ {token: "JWT..."}  │
                    └─────────┬──────────┘
                              │
                              │ Token saved to localStorage
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   🎉 DASHBOARD PAGE                              │
│                     (/dashboard)                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Acabou o Mony          Usuário ID: 123        [SAIR]    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│              🎉 Bem-vindo ao Acabou o Mony!                     │
│              Você está autenticado com sucesso.                 │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │     💳       │  │     💰       │  │     👤       │         │
│  │   Cartões    │  │  Transações  │  │    Conta     │         │
│  │ Gerencie seus│  │ Visualize seu│  │ Gerencie sua │         │
│  │   cartões    │  │  histórico   │  │    conta     │         │
│  │ [Em breve]   │  │ [Em breve]   │  │ [Em breve]   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐                                               │
│  │     🔔       │                                               │
│  │ Notificações │                                               │
│  │ Configurações│                                               │
│  │  de alertas  │                                               │
│  │ [Em breve]   │                                               │
│  └──────────────┘                                               │
│                                                                  │
│  ╔════════════════════════════════════════════════════╗        │
│  ║ Seu Token JWT                                      ║        │
│  ║ ┌────────────────────────────────────────────────┐ ║        │
│  ║ │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...       │ ║        │
│  ║ └────────────────────────────────────────────────┘ ║        │
│  ║ Use este token para fazer requisições autenticadas║        │
│  ╚════════════════════════════════════════════════════╝        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ User clicks "SAIR"
                             ▼
                    ┌────────────────────┐
                    │ Logout:            │
                    │ - Clear token      │
                    │ - Clear user data  │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │ Redirect to /login │
                    └────────────────────┘
```

## 🔄 State Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION STATE                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Initial State:                                              │
│  ├─ user: null                                               │
│  ├─ token: null                                              │
│  └─ isAuthenticated: false                                   │
│                                                              │
│  After Login (Step 1):                                       │
│  ├─ tempUserId: 123 (in localStorage)                       │
│  └─ Redirect to /verify-2fa                                  │
│                                                              │
│  After 2FA Verification (Step 2):                            │
│  ├─ user: { id: 123 }                                        │
│  ├─ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."        │
│  ├─ isAuthenticated: true                                    │
│  ├─ localStorage: authToken, userId                          │
│  └─ Redirect to /dashboard                                   │
│                                                              │
│  After Logout:                                               │
│  ├─ user: null                                               │
│  ├─ token: null                                              │
│  ├─ isAuthenticated: false                                   │
│  ├─ localStorage: cleared                                    │
│  └─ Redirect to /login                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Security Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                            │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: Route Protection                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ ProtectedRoute Component                               │ │
│  │ ├─ Check: isAuthenticated?                             │ │
│  │ ├─ YES → Render protected page                         │ │
│  │ └─ NO  → Redirect to /login                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Layer 2: API Request Interceptor                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Axios Interceptor                                      │ │
│  │ ├─ Get token from localStorage                         │ │
│  │ ├─ Add to request header: Authorization: Bearer TOKEN  │ │
│  │ └─ Send request to backend                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Layer 3: Backend Validation                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Gateway + Auth Service                                 │ │
│  │ ├─ Validate JWT token                                  │ │
│  │ ├─ Check token expiration                              │ │
│  │ ├─ Verify user permissions                             │ │
│  │ └─ Process request or return 401/403                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## 📱 Responsive Design

```
Desktop (> 768px)          Mobile (< 768px)
┌──────────────────┐      ┌────────────┐
│                  │      │            │
│  ┌────────────┐  │      │ ┌────────┐ │
│  │   Login    │  │      │ │ Login  │ │
│  │   Form     │  │      │ │  Form  │ │
│  │            │  │      │ │        │ │
│  │  [Email]   │  │      │ [Email]  │ │
│  │  [Pass]    │  │      │ [Pass]   │ │
│  │  [Button]  │  │      │ [Button] │ │
│  └────────────┘  │      │ └────────┘ │
│                  │      │            │
└──────────────────┘      └────────────┘
   Max-width: 420px        Full width
   Centered                Padded
```

## 🎨 Color Scheme

```
Primary Gradient:
┌────────────────────────────────────┐
│ #667eea ────────────────► #764ba2  │
│ (Purple)                (Dark Purple)
└────────────────────────────────────┘

Backgrounds:
┌─────────┬─────────┬─────────┐
│ #ffffff │ #f7fafc │ #e2e8f0 │
│  White  │  Light  │ Border  │
└─────────┴─────────┴─────────┘

Text Colors:
┌─────────┬─────────┬─────────┐
│ #1a202c │ #2d3748 │ #718096 │
│ Primary │ Heading │  Muted  │
└─────────┴─────────┴─────────┘

Status Colors:
┌─────────┬─────────┬─────────┐
│ #c53030 │ #38a169 │ #3182ce │
│  Error  │ Success │  Info   │
└─────────┴─────────┴─────────┘
```

## 🚀 Performance Metrics

```
Target Performance:
├─ Initial Load: < 2s
├─ Login Request: < 1s
├─ 2FA Verification: < 1s
├─ Page Transitions: < 300ms
└─ Token Validation: < 100ms
```

---

**Visual guide complete! 🎨**

This shows the complete user journey through the authentication flow.
