import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Verify2FAPage from './pages/Verify2FAPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import CreateUserPage from './pages/CreateUserPage';
import UserDetailPage from './pages/UserDetailPage';
import AccountsPage from './pages/AccountsPage';
import CreateAccountPage from './pages/CreateAccountPage';
import AccountDetailPage from './pages/AccountDetailPage';
import AuditLogsPage from './pages/AuditLogsPage';
import AuditLogDetailPage from './pages/AuditLogDetailPage';
import CardsPage from './pages/CardsPage';
import CreateCardPage from './pages/CreateCardPage';
import TransactionsPage from './pages/TransactionsPage';
import CreateTransactionPage from './pages/CreateTransactionPage';
import TransactionDetailPage from './pages/TransactionDetailPage';
import './App.css';

function AppLayout() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="app-main">
        <header className="app-header">
          <div className="header-left">
            <div className="header-title">
              <h1>AcabouMony</h1>
              <p>Sistema de Gerenciamento Bancário</p>
            </div>
          </div>
          <div className="header-right">
            <div className="user-badge">
              <div className="user-avatar">{user?.username?.charAt(0).toUpperCase() || 'U'}</div>
              <div className="user-info">
                <div>{user?.username || 'Usuário'}</div>
                <div style={{ fontSize: '11px', opacity: 0.7 }}>Conectado</div>
              </div>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </header>
        <div className="app-content">
          <div className="page-container">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/accounts/create" element={<CreateAccountPage />} />
              <Route path="/accounts/:id" element={<AccountDetailPage />} />
              <Route path="/cards" element={<CardsPage />} />
              <Route path="/cards/create" element={<CreateCardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/transactions/create" element={<CreateTransactionPage />} />
              <Route path="/transactions/:id" element={<TransactionDetailPage />} />
              <Route path="/audit-logs" element={<AuditLogsPage />} />
              <Route path="/audit-logs/:id" element={<AuditLogDetailPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/create" element={<CreateUserPage />} />
              <Route path="/users/:id" element={<UserDetailPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-2fa" element={<Verify2FAPage />} />
          
          {/* Protected Routes with Layout */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            } 
          />
          
          {/* Default */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

