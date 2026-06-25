# 🖥️ Acabou o Mony - Frontend

> **React + Vite** application for the Acabou o Mony fintech platform

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn
- Backend services running (Gateway on port 8088)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Access: `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   └── ProtectedRoute.jsx
├── context/            # Global state management
│   └── AuthContext.jsx
├── pages/              # Page components
│   ├── LoginPage.jsx
│   ├── Verify2FAPage.jsx
│   └── DashboardPage.jsx
├── services/           # API services
│   └── api.js
└── App.jsx            # Main routes
```

---

## 🔐 Authentication Flow

1. **Login** (`/login`) - Enter email and password
2. **2FA Verification** (`/verify-2fa`) - Enter 6-digit code
3. **Dashboard** (`/dashboard`) - Access protected content

**Test Credentials:**
- Email: `user@example.com`
- Password: `password123`
- 2FA Code: Check backend logs

---

## 🛠️ Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.6 | UI Framework |
| React Router | 6.x | Routing |
| Axios | 1.18.0 | HTTP Client |
| Vite | Latest | Build Tool |

---

## 📚 Documentation

For comprehensive documentation, see:
- **[Frontend Guide](../docs/frontend-guide.md)** - Complete development guide
- **[API Contracts](../docs/api-contracts.md)** - API documentation
- **[Architecture](../docs/architecture.md)** - System architecture

---

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

---

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## 🔗 API Integration

**Base URL**: `http://localhost:8088`

**Endpoints:**
- `POST /api/acabou-mony-auth/login` - Login
- `POST /api/acabou-mony-auth/verify-2fa` - Verify 2FA
- `GET /api/acabou-mony-transaction/transactions` - Get transactions

See [API Contracts](../docs/api-contracts.md) for full documentation.

---

## 🐛 Troubleshooting

### CORS Errors
Ensure Gateway CORS configuration allows `http://localhost:5173`

### Token Issues
1. Check localStorage for token
2. Verify token format: `Bearer <token>`
3. Check token expiration (24 hours)

### 2FA Code Not Working
Check backend logs for the generated code

---

## 🚀 Next Steps

- [ ] Implement Transactions page
- [ ] Implement Cards management
- [ ] Add Profile page
- [ ] Implement Notifications
- [ ] Add Dark mode
- [ ] Add Unit tests

---

**Last Updated**: 2024-01-15  
**Maintained By**: Frontend Team
