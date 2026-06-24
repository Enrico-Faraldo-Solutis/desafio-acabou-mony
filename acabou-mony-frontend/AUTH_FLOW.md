# Authentication Flow - Acabou o Mony Frontend

## Overview
This frontend implements a **two-factor authentication (2FA)** flow for the Acabou o Mony platform, following the security requirements from Story 3 in the project requirements.

## Authentication Flow

### 1. Login Page (`/login`)
- User enters **email** and **password**
- Frontend calls `POST /api/acabou-mony-auth/login`
- Backend validates credentials and sends 2FA code
- Response contains:
  ```json
  {
    "usuarioId": 123,
    "mensagem": "Credenciais válidas. Código 2FA enviado."
  }
  ```
- User is redirected to `/verify-2fa` page

### 2. 2FA Verification Page (`/verify-2fa`)
- User enters the **6-digit code** received
- Frontend calls `POST /api/acabou-mony-auth/verify-2fa`
- Request body:
  ```json
  {
    "usuarioId": 123,
    "codigo": "123456"
  }
  ```
- Backend validates the code and returns JWT token
- Response contains:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- Token is stored in `localStorage`
- User is redirected to `/dashboard`

### 3. Dashboard Page (`/dashboard`)
- **Protected route** - requires authentication
- Displays user information and JWT token
- Provides access to future features (cards, transactions, etc.)
- Logout functionality clears token and redirects to login

## Project Structure

```
src/
├── components/
│   └── ProtectedRoute.jsx      # Route guard for authenticated pages
├── context/
│   └── AuthContext.jsx          # Global authentication state
├── pages/
│   ├── LoginPage.jsx            # Step 1: Email/Password login
│   ├── LoginPage.css
│   ├── Verify2FAPage.jsx        # Step 2: 2FA code verification
│   ├── Verify2FAPage.css
│   ├── DashboardPage.jsx        # Protected dashboard
│   └── DashboardPage.css
├── services/
│   └── api.js                   # API service layer with axios
├── App.jsx                      # Main routing configuration
├── main.jsx                     # App entry point
└── index.css                    # Global styles
```

## Key Features

### Security (Story 3 Requirements)
- ✅ **HTTPS**: All API calls go through the gateway (configure HTTPS in production)
- ✅ **Two-Step Verification**: Implemented via 2FA code
- ✅ **JWT Token**: Secure token-based authentication
- ✅ **Protected Routes**: Dashboard only accessible when authenticated

### API Integration
- Centralized API service in `src/services/api.js`
- Automatic token injection in request headers
- Error handling with user-friendly messages
- Base URL: `http://localhost:8088/api` (Gateway)

### State Management
- React Context API for global auth state
- Persistent authentication via `localStorage`
- Automatic redirect for unauthenticated users

## Running the Application

1. **Start the backend services**:
   ```bash
   # Gateway (port 8088)
   # Auth Service (port 8081)
   ```

2. **Start the frontend**:
   ```bash
   cd acabou-mony-frontend
   npm run dev
   ```

3. **Access the application**:
   - Open `http://localhost:5173`
   - Login with valid credentials
   - Enter 2FA code
   - Access dashboard

## Next Steps

Based on the project requirements (enunciado.md), the following features should be implemented:

### Story 1: Transaction Processing
- Create transaction pages
- Implement real-time transaction status
- Add transaction history

### Story 2: Scalability
- Implement loading states
- Add error boundaries
- Optimize performance

### Story 4: Live Commerce Integration
- Create Live Commerce interface
- Implement real-time payment during live streams
- Add conversational commerce chat interface

## API Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/acabou-mony-auth/login` | POST | Initial login with email/password |
| `/api/acabou-mony-auth/verify-2fa` | POST | Verify 2FA code and get JWT token |

## Environment Variables

Create a `.env` file for configuration:

```env
VITE_API_BASE_URL=http://localhost:8088/api
VITE_APP_NAME=Acabou o Mony
```

## Notes

- The 2FA code is currently sent by the backend (implementation in auth service)
- Token expiration handling should be implemented
- Refresh token mechanism should be added for better UX
- HTTPS should be enabled in production environments
