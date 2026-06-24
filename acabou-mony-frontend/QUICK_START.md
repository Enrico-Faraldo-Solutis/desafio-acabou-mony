# 🚀 Quick Start Guide - Acabou o Mony Frontend

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend services running:
  - Gateway (port 8088)
  - Auth Service (port 8081)

## Installation

```bash
cd acabou-mony-frontend
npm install
```

## Running the App

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Testing the Authentication Flow

### Step 1: Login
1. Open `http://localhost:5173`
2. You'll be redirected to `/login`
3. Enter your credentials:
   - Email: `your-email@example.com`
   - Password: `your-password`
4. Click "Entrar"

### Step 2: 2FA Verification
1. After successful login, you'll be redirected to `/verify-2fa`
2. Check your email or backend console for the 2FA code
3. Enter the 6-digit code
4. Click "Verificar"

### Step 3: Dashboard
1. After successful 2FA verification, you'll be redirected to `/dashboard`
2. You'll see:
   - Welcome message
   - Your JWT token
   - Feature cards (coming soon)
3. Click "Sair" to logout

## Project Structure

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
└── App.jsx            # Main app with routing
```

## Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## API Endpoints

The frontend communicates with these endpoints through the gateway:

- `POST /api/acabou-mony-auth/login` - Initial login
- `POST /api/acabou-mony-auth/verify-2fa` - 2FA verification

## Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8088/api
```

## Troubleshooting

### CORS Errors
- Make sure the gateway service has CORS configured for `http://localhost:5173`
- Check that the gateway is running on port 8088

### 403 Forbidden
- Ensure CSRF is disabled in the gateway's SecurityConfig
- Verify the gateway's `scanBasePackages` includes the config package

### Token Not Working
- Check browser console for errors
- Verify token is stored in localStorage (DevTools → Application → Local Storage)
- Ensure the auth service is generating valid JWT tokens

### 2FA Code Not Received
- Check the auth service logs for the generated code
- Verify email service is configured (if using email)
- For development, codes may be logged to console

## Next Steps

1. **Customize Styling**: Edit CSS files in `src/pages/`
2. **Add Features**: Create new pages for transactions, cards, etc.
3. **Integrate APIs**: Add more service methods in `src/services/api.js`
4. **Implement Stories**: Follow the requirements in `enunciado.md`

## Support

For more details, see:
- `AUTH_FLOW.md` - Complete authentication flow documentation
- `IMPLEMENTATION_SUMMARY.md` - Detailed implementation overview

---

**Happy coding! 🎉**
