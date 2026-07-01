import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/transactionService';
import './TransactionsPage.css';

function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadTransactions();

    // Check if there's a success message
    if (location.state?.message) {
      setSuccess(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    }
  }, [location]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await transactionService.getAllTransactions();
      console.log('Transactions response:', response);
      setTransactions(response || []);
    } catch (err) {
      console.error('Erro ao carregar transações:', err);
      setError('Erro ao carregar transações.');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (tipo) => {
    switch (tipo?.toUpperCase()) {
      case 'CREDITO':
      case 'DEPOSITO':
        return '💰';
      case 'DEBITO':
      case 'SAQUE':
        return '💸';
      case 'TRANSFERENCIA':
        return '🔄';
      default:
        return '💳';
    }
  };

  const getTransactionColor = (tipo) => {
    switch (tipo?.toUpperCase()) {
      case 'CREDITO':
      case 'DEPOSITO':
        return 'success';
      case 'DEBITO':
      case 'SAQUE':
        return 'danger';
      default:
        return 'info';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div className="page-title">
          <h1>💸 Transações</h1>
          <p>Histórico de movimentações bancárias</p>
        </div>
        <div className="page-actions">
          <button className="btn-primary-action" onClick={() => navigate('/transactions/create')}>
            ➕ Nova Transação
          </button>
        </div>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💸</div>
          <h3>Nenhuma transação encontrada</h3>
          <p>Clique em "Nova Transação" para criar sua primeira transação</p>
        </div>
      ) : (
        <div className="transactions-list">
          {transactions.map((tx) => (
            <div 
              key={tx.id} 
              className="transaction-item"
              onClick={() => navigate(`/transactions/${tx.id}`)}
            >
              <div className="transaction-icon">{getTransactionIcon(tx.tipo)}</div>
              <div className="transaction-info">
                <h4 className="transaction-title">
                  {tx.tipo || 'Transação'} - Conta #{tx.contaOrigemId} → #{tx.contaDestinoId}
                </h4>
                <p className="transaction-time">{formatDate(tx.dataHora)}</p>
              </div>
              <div className="transaction-amount">
                <span className={`amount ${getTransactionColor(tx.tipo)}`}>
                  R$ {(tx.valor || 0).toFixed(2)}
                </span>
                <span className="status-badge success">
                  Concluída
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionsPage;

