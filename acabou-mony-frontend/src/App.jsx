import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Verify2FAPage from './pages/Verify2FAPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import CreateUserPage from './pages/CreateUserPage';
import UserDetailPage from './pages/UserDetailPage';
import AccountsPage from './pages/AccountsPage';
import AccountDetailPage from './pages/AccountDetailPage';
import AuditLogsPage from './pages/AuditLogsPage';
import AuditLogDetailPage from './pages/AuditLogDetailPage';
import CardsPage from './pages/CardsPage';
import TransactionsPage from './pages/TransactionsPage';
import TransactionDetailPage from './pages/TransactionDetailPage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-2fa" element={<Verify2FAPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* User Management Routes */}
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/create" 
            element={
              <ProtectedRoute>
                <CreateUserPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/:id" 
            element={
              <ProtectedRoute>
                <UserDetailPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Account Management Routes */}
          <Route 
            path="/accounts" 
            element={
              <ProtectedRoute>
                <AccountsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/accounts/:id" 
            element={
              <ProtectedRoute>
                <AccountDetailPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Audit Log Routes */}
          <Route 
            path="/audit-logs" 
            element={
              <ProtectedRoute>
                <AuditLogsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/audit-logs/:id" 
            element={
              <ProtectedRoute>
                <AuditLogDetailPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Card Management Routes */}
          <Route 
            path="/cards" 
            element={
              <ProtectedRoute>
                <CardsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Transaction Management Routes */}
          <Route 
            path="/transactions" 
            element={
              <ProtectedRoute>
                <TransactionsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transactions/:id" 
            element={
              <ProtectedRoute>
                <TransactionDetailPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Default Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
