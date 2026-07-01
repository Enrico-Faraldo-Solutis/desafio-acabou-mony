# Acabou Mony - Frontend Technical Specification

## 1. Project Overview

### 1.1 Purpose
This document specifies the complete frontend architecture for **Acabou Mony**, a personal finance management application. The frontend is a React-based Single Page Application (SPA) that integrates with three backend microservices: Auth Service, User Service, and Transaction Service.

### 1.2 Technology Stack
- **Framework**: React 18+ (JavaScript/JSX - NO TypeScript)
- **Styling**: Pure CSS (separate .css files - NO Tailwind, Bootstrap, or UI libraries)
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router DOM v6
- **State Management**: React Context API + useState/useReducer
- **Authentication**: JWT tokens stored in localStorage
- **Build Tool**: Create React App (CRA) or Vite

---

## 2. Backend API Integration Map

### 2.1 Auth Service (Port 8001)
**Base URL**: `http://localhost:8001`

| Endpoint | Method | Purpose | Request Body | Response | Frontend Usage |
|----------|--------|---------|--------------|----------|----------------|
| `/auth/register` | POST | User registration | `{username, email, password}` | `{id, username, email, created_at}` | Registration page |
| `/auth/login` | POST | User login | `{username, password}` | `{access_token, token_type}` | Login page |
| `/auth/me` | GET | Get current user | - | `{id, username, email, is_active, created_at}` | Protected routes validation |

### 2.2 User Service (Port 8002)
**Base URL**: `http://localhost:8002`

| Endpoint | Method | Purpose | Request Body | Response | Frontend Usage |
|----------|--------|---------|--------------|----------|----------------|
| `/users/me` | GET | Get user profile | - | `{id, username, email, full_name, is_active, created_at, updated_at}` | Profile page, Dashboard header |
| `/users/me` | PUT | Update profile | `{email?, full_name?}` | Updated user object | Profile edit form |
| `/users/me/password` | PUT | Change password | `{current_password, new_password}` | `{message}` | Password change form |

### 2.3 Transaction Service (Port 8003)
**Base URL**: `http://localhost:8003`

| Endpoint | Method | Purpose | Request Body | Response | Frontend Usage |
|----------|--------|---------|--------------|----------|----------------|
| `/transactions/` | GET | List transactions | Query: `skip`, `limit`, `type`, `category` | `[{id, user_id, type, amount, category, description, date, created_at}]` | Transaction list, Dashboard |
| `/transactions/` | POST | Create transaction | `{type, amount, category, description?, date?}` | Transaction object | Add transaction form |
| `/transactions/{id}` | GET | Get single transaction | - | Transaction object | Transaction detail view |
| `/transactions/{id}` | PUT | Update transaction | `{type?, amount?, category?, description?, date?}` | Updated transaction | Edit transaction form |
| `/transactions/{id}` | DELETE | Delete transaction | - | `{message}` | Delete confirmation |
| `/transactions/summary` | GET | Get financial summary | Query: `start_date?`, `end_date?` | `{total_income, total_expense, balance, by_category}` | Dashboard summary cards |

---

## 3. Frontend Architecture

### 3.1 Directory Structure
```
acabou-mony-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── api/
│   │   ├── axios.js              # Axios instance with interceptors
│   │   ├── authApi.js            # Auth service endpoints
│   │   ├── userApi.js            # User service endpoints
│   │   └── transactionApi.js    # Transaction service endpoints
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.css
│   │   │   ├── Input.jsx
│   │   │   ├── Input.css
│   │   │   ├── Modal.jsx
│   │   │   ├── Modal.css
│   │   │   ├── Loader.jsx
│   │   │   ├── Loader.css
│   │   │   ├── Alert.jsx
│   │   │   └── Alert.css
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Header.css
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Sidebar.css
│   │   │   ├── Layout.jsx
│   │   │   └── Layout.css
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── LoginForm.css
│   │   │   ├── RegisterForm.jsx
│   │   │   └── RegisterForm.css
│   │   ├── dashboard/
│   │   │   ├── SummaryCard.jsx
│   │   │   ├── SummaryCard.css
│   │   │   ├── RecentTransactions.jsx
│   │   │   ├── RecentTransactions.css
│   │   │   ├── CategoryChart.jsx
│   │   │   └── CategoryChart.css
│   │   ├── transactions/
│   │   │   ├── TransactionList.jsx
│   │   │   ├── TransactionList.css
│   │   │   ├── TransactionItem.jsx
│   │   │   ├── TransactionItem.css
│   │   │   ├── TransactionForm.jsx
│   │   │   ├── TransactionForm.css
│   │   │   ├── TransactionFilters.jsx
│   │   │   └── TransactionFilters.css
│   │   └── profile/
│   │       ├── ProfileInfo.jsx
│   │       ├── ProfileInfo.css
│   │       ├── PasswordChange.jsx
│   │       └── PasswordChange.css
│   ├── context/
│   │   ├── AuthContext.jsx       # Authentication state & methods
│   │   └── TransactionContext.jsx # Transaction state & methods
│   ├── hooks/
│   │   ├── useAuth.js            # Custom hook for auth
│   │   └── useTransactions.js    # Custom hook for transactions
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── LoginPage.css
│   │   ├── RegisterPage.jsx
│   │   ├── RegisterPage.css
│   │   ├── DashboardPage.jsx
│   │   ├── DashboardPage.css
│   │   ├── TransactionsPage.jsx
│   │   ├── TransactionsPage.css
│   │   ├── ProfilePage.jsx
│   │   └── ProfilePage.css
│   ├── routes/
│   │   ├── AppRoutes.jsx         # Main routing configuration
│   │   └── ProtectedRoute.jsx    # Auth guard component
│   ├── utils/
│   │   ├── constants.js          # App constants
│   │   ├── formatters.js         # Date, currency formatters
│   │   └── validators.js         # Form validation helpers
│   ├── styles/
│   │   ├── global.css            # Global styles & CSS variables
│   │   └── reset.css             # CSS reset
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### 3.2 Component Hierarchy

```
App
├── AuthContext.Provider
│   └── TransactionContext.Provider
│       └── AppRoutes
│           ├── Public Routes
│           │   ├── LoginPage
│           │   │   └── LoginForm
│           │   └── RegisterPage
│           │       └── RegisterForm
│           └── Protected Routes
│               └── Layout
│                   ├── Header
│                   ├── Sidebar
│                   └── Outlet
│                       ├── DashboardPage
│                       │   ├── SummaryCard (x4)
│                       │   ├── CategoryChart
│                       │   └── RecentTransactions
│                       ├── TransactionsPage
│                       │   ├── TransactionFilters
│                       │   ├── TransactionForm (Modal)
│                       │   └── TransactionList
│                       │       └── TransactionItem (x N)
│                       └── ProfilePage
│                           ├── ProfileInfo
│                           └── PasswordChange
```

---

## 4. State Management Design

### 4.1 AuthContext State
```javascript
{
  user: {
    id: number,
    username: string,
    email: string,
    full_name: string | null,
    is_active: boolean
  } | null,
  token: string | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null
}
```

**Methods**:
- `login(username, password)` → Authenticates user, stores token
- `register(username, email, password)` → Creates new user account
- `logout()` → Clears token and user state
- `updateProfile(data)` → Updates user profile information
- `changePassword(currentPassword, newPassword)` → Changes user password

### 4.2 TransactionContext State
```javascript
{
  transactions: Array<Transaction>,
  summary: {
    total_income: number,
    total_expense: number,
    balance: number,
    by_category: Object
  } | null,
  filters: {
    type: 'income' | 'expense' | null,
    category: string | null,
    startDate: string | null,
    endDate: string | null
  },
  isLoading: boolean,
  error: string | null
}
```

**Methods**:
- `fetchTransactions(filters)` → Loads transactions with filters
- `fetchSummary(startDate, endDate)` → Loads financial summary
- `createTransaction(data)` → Creates new transaction
- `updateTransaction(id, data)` → Updates existing transaction
- `deleteTransaction(id)` → Deletes transaction
- `setFilters(filters)` → Updates filter state

---

## 5. Authentication Flow

### 5.1 Login Flow
1. User enters credentials in `LoginForm`
2. Form validates input (client-side)
3. `AuthContext.login()` calls `POST /auth/login`
4. On success:
   - Store JWT token in `localStorage`
   - Set Axios default Authorization header
   - Fetch user profile from `GET /auth/me`
   - Update AuthContext state
   - Redirect to `/dashboard`
5. On failure:
   - Display error message
   - Clear any stored tokens

### 5.2 Registration Flow
1. User fills registration form
2. Validate password strength, email format
3. `AuthContext.register()` calls `POST /auth/register`
4. On success:
   - Automatically log in user
   - Follow login flow steps 4-5
5. On failure:
   - Display validation errors

### 5.3 Token Management
- **Storage**: `localStorage.setItem('token', token)`
- **Retrieval**: On app load, check localStorage for token
- **Validation**: Call `GET /auth/me` to verify token validity
- **Refresh**: No refresh token (session-based, re-login on expiry)
- **Interceptor**: Axios request interceptor adds `Authorization: Bearer {token}`
- **Error Handling**: 401 responses trigger logout and redirect to login

### 5.4 Protected Routes
- `ProtectedRoute` component wraps authenticated pages
- Checks `AuthContext.isAuthenticated`
- Redirects to `/login` if not authenticated
- Shows loader while checking authentication status

---

## 6. Key Features & User Flows

### 6.1 Dashboard
**Purpose**: Overview of financial status

**Components**:
- 4 Summary Cards: Total Income, Total Expenses, Balance, Transaction Count
- Category breakdown chart (visual representation)
- Recent transactions list (last 10)

**Data Sources**:
- `GET /transactions/summary` → Summary cards
- `GET /transactions/?limit=10` → Recent transactions

### 6.2 Transactions Management
**Purpose**: Full CRUD operations on transactions

**Features**:
- **List View**: Paginated table with all transactions
- **Filters**: By type (income/expense), category, date range
- **Add**: Modal form to create new transaction
- **Edit**: Inline or modal edit form
- **Delete**: Confirmation dialog before deletion
- **Search**: Real-time filtering

**Data Sources**:
- `GET /transactions/` with query params
- `POST /transactions/` for creation
- `PUT /transactions/{id}` for updates
- `DELETE /transactions/{id}` for deletion

### 6.3 User Profile
**Purpose**: Manage user account settings

**Features**:
- **View Profile**: Display username, email, full name
- **Edit Profile**: Update email and full name
- **Change Password**: Secure password update form

**Data Sources**:
- `GET /users/me` → Profile data
- `PUT /users/me` → Update profile
- `PUT /users/me/password` → Change password

---

## 7. UI/UX Design Principles

### 7.1 Color Scheme
```css
:root {
  /* Primary Colors */
  --primary-color: #4F46E5;      /* Indigo */
  --primary-dark: #4338CA;
  --primary-light: #818CF8;
  
  /* Semantic Colors */
  --success-color: #10B981;      /* Green - Income */
  --danger-color: #EF4444;       /* Red - Expense */
  --warning-color: #F59E0B;      /* Amber */
  --info-color: #3B82F6;         /* Blue */
  
  /* Neutral Colors */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;
  --bg-tertiary: #F3F4F6;
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --border-color: #E5E7EB;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### 7.2 Typography
- **Font Family**: System fonts (sans-serif)
- **Headings**: Bold, larger sizes (h1: 2rem, h2: 1.5rem, h3: 1.25rem)
- **Body**: Regular weight, 1rem base size
- **Line Height**: 1.5 for readability

### 7.3 Layout Patterns
- **Responsive**: Mobile-first approach
- **Grid System**: CSS Grid for page layouts
- **Flexbox**: Component-level layouts
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### 7.4 Form Design
- Clear labels above inputs
- Validation messages below inputs
- Disabled state for submit buttons during API calls
- Success/error feedback after submission

### 7.5 Transaction Type Indicators
- **Income**: Green color, "+" prefix, upward arrow icon
- **Expense**: Red color, "-" prefix, downward arrow icon

---

## 8. Error Handling Strategy

### 8.1 API Error Handling
```javascript
// Axios interceptor catches all errors
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Unauthorized - logout and redirect
      logout();
      navigate('/login');
    } else if (error.response?.status === 404) {
      // Not found - show user-friendly message
    } else if (error.response?.status >= 500) {
      // Server error - show generic error
    }
    return Promise.reject(error);
  }
);
```

### 8.2 Form Validation
- **Client-side**: Validate before API call
- **Server-side**: Display backend validation errors
- **Real-time**: Validate on blur for better UX

### 8.3 User Feedback
- **Success**: Green alert/toast message
- **Error**: Red alert with specific error message
- **Loading**: Spinner or skeleton screens
- **Empty States**: Friendly messages when no data

---

## 9. Performance Considerations

### 9.1 Optimization Techniques
- **Lazy Loading**: Code splitting for routes
- **Memoization**: React.memo for expensive components
- **Debouncing**: Search and filter inputs
- **Pagination**: Limit API data fetching
- **Caching**: Store frequently accessed data in context

### 9.2 API Call Optimization
- Avoid redundant calls (check if data exists)
- Cancel pending requests on component unmount
- Batch related API calls when possible

---

## 10. Security Considerations

### 10.1 Token Security
- Store JWT in localStorage (XSS risk acknowledged)
- Clear token on logout
- Validate token on app initialization
- Auto-logout on token expiration

### 10.2 Input Sanitization
- Validate all user inputs
- Prevent XSS through React's built-in escaping
- Use proper HTTP methods (POST for mutations)

### 10.3 CORS Configuration
- Backend must allow frontend origin
- Credentials included in requests if needed

---

## 11. Testing Strategy (Future Enhancement)

### 11.1 Unit Tests
- Test utility functions (formatters, validators)
- Test custom hooks in isolation

### 11.2 Integration Tests
- Test API integration with mock server
- Test context providers

### 11.3 E2E Tests
- Test complete user flows (login → create transaction → logout)

---

## 12. Deployment Considerations

### 12.1 Environment Variables
```
REACT_APP_AUTH_SERVICE_URL=http://localhost:8001
REACT_APP_USER_SERVICE_URL=http://localhost:8002
REACT_APP_TRANSACTION_SERVICE_URL=http://localhost:8003
```

### 12.2 Build Process
- `npm run build` creates production bundle
- Serve static files via Nginx or similar
- Configure proper CORS on backend for production domain

### 12.3 Docker Integration (Optional)
- Create Dockerfile for frontend
- Add frontend service to docker-compose.yml
- Expose on port 3000

---

## 13. Future Enhancements

### 13.1 Planned Features
- [ ] Budget tracking and alerts
- [ ] Recurring transactions
- [ ] Data export (CSV, PDF)
- [ ] Multi-currency support
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)

### 13.2 Technical Improvements
- [ ] Add Redux for complex state management
- [ ] Implement service workers for offline support
- [ ] Add real-time updates via WebSockets
- [ ] Implement comprehensive test suite
- [ ] Add analytics tracking

---

## 14. API Response Examples

### 14.1 Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 14.2 User Profile Response
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-20T14:45:00"
}
```

### 14.3 Transaction List Response
```json
[
  {
    "id": 1,
    "user_id": 1,
    "type": "income",
    "amount": 5000.00,
    "category": "salary",
    "description": "Monthly salary",
    "date": "2024-01-01",
    "created_at": "2024-01-01T09:00:00"
  },
  {
    "id": 2,
    "user_id": 1,
    "type": "expense",
    "amount": 150.00,
    "category": "groceries",
    "description": "Weekly shopping",
    "date": "2024-01-05",
    "created_at": "2024-01-05T18:30:00"
  }
]
```

### 14.4 Summary Response
```json
{
  "total_income": 5000.00,
  "total_expense": 1250.00,
  "balance": 3750.00,
  "by_category": {
    "salary": 5000.00,
    "groceries": 450.00,
    "utilities": 300.00,
    "entertainment": 500.00
  }
}
```

---

## 15. Conclusion

This specification provides a complete blueprint for building the Acabou Mony frontend. The architecture is designed to be:
- **Maintainable**: Clear separation of concerns
- **Scalable**: Easy to add new features
- **Performant**: Optimized API calls and rendering
- **Secure**: Proper authentication and authorization
- **User-friendly**: Intuitive UI/UX design

All components, pages, and utilities are mapped to specific backend endpoints, ensuring seamless integration with the existing microservices architecture.