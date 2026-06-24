import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../services/transactionService';
import { accountService } from '../services/accountService';
import './TransactionsPage.css';

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterAccount, setFilterAccount] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    contaOrigemId: '',
    contaDestinoId: '',
    valor: '',
    descricao: ''
  });
  const [creating, setCreating] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadAccounts();
    loadTransactions();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [filterAccount]);

  const loadAccounts = async () => {
    try {
      const response = await accountService.listAllAccounts(0, 100);
      setAccounts(response.content || []);
    } catch (err) {
      console.error('Error loading accounts:', err);
    }
  };

  const loadTransactions = async () => {
    setLoading(true);
    setError('');
    
    try {
      let transactionsData;
      if (filterAccount === 'all') {
        transactionsData = await transactionService.getAllTransactions();
      } else {
        transactionsData = await transactionService.getTransactionsByAccount(filterAccount);
      }
      setTransactions(transactionsData || []);
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError('Erro ao carregar transações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      await transactionService.createTransaction({
        ...createForm,
        valor: parseFloat(createForm.valor)
      });
      
      setShowCreateModal(false);
      setCreateForm({
        contaOrigemId: '',
        contaDestinoId: '',
        valor: '',
        descricao: ''
      });
      
      // Reload transactions
      loadTransactions();
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError(
        err.response?.data?.message || 
        'Erro ao criar transação. Verifique os dados e tente novamente.'
      );
    } finally {
      setCreating(false);
    }
  };

  const handleViewTransaction = (transactionId) => {
    navigate(`/transactions/${transactionId}`);
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

  if (loading && transactions.length === 0) {
    return (
      <div className="transactions-page">
        <div className="loading">Carregando transações...</div>
      </div>
    );
  }

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <div>
          <h1>💰 Transações</h1>
          <p>Gerencie e visualize transações financeiras</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)} 
          className="btn-primary"
        >
          + Nova Transação
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filter Section */}
      <div className="filter-section">
        <label htmlFor="account-filter">Filtrar por Conta:</label>
        <select
          id="account-filter"
          value={filterAccount}
          onChange={(e) => setFilterAccount(e.target.value)}
          className="filter-select"
        >
          <option value="all">Todas as Transações</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              Conta #{account.id} - R$ {account.saldo?.toFixed(2) || '0.00'}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="transactions-stats">
        <div className="stat-card">
          <span className="stat-label">Total de Transações</span>
          <span className="stat-value">{transactions.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Volume Total</span>
          <span className="stat-value">
            {formatCurrency(transactions.reduce((sum, t) => sum + (t.valor || 0), 0))}
          </span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="transactions-table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data/Hora</th>
              <th>Origem</th>
              <th>Destino</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">
                  Nenhuma transação encontrada
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>#{transaction.id}</td>
                  <td>{formatTimestamp(transaction.dataHora)}</td>
                  <td>Conta #{transaction.contaOrigemId}</td>
                  <td>Conta #{transaction.contaDestinoId}</td>
                  <td className="amount-cell">{formatCurrency(transaction.valor)}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(transaction.status)}`}>
                      {getStatusLabel(transaction.status)}
                    </span>
                  </td>
                  <td className="description-cell">
                    {transaction.descricao || '-'}
                  </td>
                  <td>
                    <button
                      onClick={() => handleViewTransaction(transaction.id)}
                      className="btn-view-small"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Transaction Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nova Transação</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="create-form">
              <div className="form-group">
                <label htmlFor="contaOrigemId">Conta de Origem *</label>
                <select
                  id="contaOrigemId"
                  value={createForm.contaOrigemId}
                  onChange={(e) => setCreateForm({ ...createForm, contaOrigemId: e.target.value })}
                  required
                  disabled={creating}
                >
                  <option value="">Selecione a conta de origem</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      Conta #{account.id} - Saldo: {formatCurrency(account.saldo)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="contaDestinoId">Conta de Destino *</label>
                <select
                  id="contaDestinoId"
                  value={createForm.contaDestinoId}
                  onChange={(e) => setCreateForm({ ...createForm, contaDestinoId: e.target.value })}
                  required
                  disabled={creating}
                >
                  <option value="">Selecione a conta de destino</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      Conta #{account.id} - Saldo: {formatCurrency(account.saldo)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="valor">Valor *</label>
                <input
                  type="number"
                  id="valor"
                  step="0.01"
                  min="0.01"
                  value={createForm.valor}
                  onChange={(e) => setCreateForm({ ...createForm, valor: e.target.value })}
                  placeholder="0.00"
                  required
                  disabled={creating}
                />
              </div>

              <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  value={createForm.descricao}
                  onChange={(e) => setCreateForm({ ...createForm, descricao: e.target.value })}
                  placeholder="Descrição da transação (opcional)"
                  rows="3"
                  disabled={creating}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                  disabled={creating}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={creating}
                >
                  {creating ? 'Processando...' : 'Criar Transação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionsPage;
