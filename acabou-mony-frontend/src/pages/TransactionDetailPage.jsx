import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { transactionService } from '../services/transactionService';
import './TransactionDetailPage.css';

function TransactionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTransactionData();
  }, [id]);

  const loadTransactionData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const transactionData = await transactionService.getTransactionById(id);
      setTransaction(transactionData);
    } catch (err) {
      console.error('Error loading transaction:', err);
      setError('Erro ao carregar transação.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/transactions');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'CONCLUIDA': 'status-success',
      'PENDENTE': 'status-pending',
      'FALHA': 'status-failed',
      'CANCELADA': 'status-cancelled'
    };
    return statusMap[status] || 'status-default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'CONCLUIDA': 'Concluída',
      'PENDENTE': 'Pendente',
      'FALHA': 'Falha',
      'CANCELADA': 'Cancelada'
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'CONCLUIDA': '✅',
      'PENDENTE': '⏳',
      'FALHA': '❌',
      'CANCELADA': '🚫'
    };
    return icons[status] || '📄';
  };

  if (loading) {
    return (
      <div className="transaction-detail-page">
        <div className="loading">Carregando transação...</div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="transaction-detail-page">
        <div className="error-message">{error || 'Transação não encontrada'}</div>
        <button onClick={handleBack} className="btn-secondary">
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="transaction-detail-page">
      <div className="transaction-detail-container">
        <div className="detail-header">
          <button onClick={handleBack} className="btn-back">
            ← Voltar
          </button>
          <h1>💰 Detalhes da Transação</h1>
        </div>

        <div className="detail-card">
          {/* Header Section */}
          <div className="transaction-header-section">
            <div className="transaction-id-badge">
              Transação #{transaction.id}
            </div>
            <div className="transaction-status-large">
              <span className="status-icon">{getStatusIcon(transaction.status)}</span>
              <span className={`status-badge-large ${getStatusBadgeClass(transaction.status)}`}>
                {getStatusLabel(transaction.status)}
              </span>
            </div>
          </div>

          {/* Amount Section */}
          <div className="amount-section">
            <div className="amount-label">Valor da Transação</div>
            <div className="amount-value">{formatCurrency(transaction.valor)}</div>
          </div>

          {/* Transaction Flow */}
          <div className="card-section">
            <h2>Fluxo da Transação</h2>
            <div className="transaction-flow">
              <div className="flow-account">
                <div className="flow-label">Origem</div>
                <div className="flow-value">Conta #{transaction.contaOrigemId}</div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-account">
                <div className="flow-label">Destino</div>
                <div className="flow-value">Conta #{transaction.contaDestinoId}</div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="card-section">
            <h2>Informações da Transação</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">ID da Transação</span>
                <span className="info-value">{transaction.id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Data e Hora</span>
                <span className="info-value">{formatTimestamp(transaction.dataTransacao)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Conta de Origem</span>
                <span className="info-value">#{transaction.contaOrigemId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Conta de Destino</span>
                <span className="info-value">#{transaction.contaDestinoId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Valor</span>
                <span className="info-value">{formatCurrency(transaction.valor)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Tipo</span>
                <span className="info-value">{transaction.tipo}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className={`status-badge ${getStatusBadgeClass(transaction.status)}`}>
                  {getStatusLabel(transaction.status)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetailPage;
