import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountService } from '../services/accountService';
import './AccountsPage.css';

function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadAccounts();
  }, [page]);

  const loadAccounts = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await accountService.listAllAccounts(page, 10, 'id');
      setAccounts(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      console.error('Error loading accounts:', err);
      setError('Erro ao carregar contas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAccount = (accountId) => {
    navigate(`/accounts/${accountId}`);
  };

  const handlePreviousPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  if (loading) {
    return (
      <div className="accounts-page">
        <div className="loading">Carregando contas...</div>
      </div>
    );
  }

  return (
    <div className="accounts-page">
      <div className="accounts-header">
        <div>
          <h1>💳 Contas</h1>
          <p>Gerencie as contas do sistema</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="accounts-stats">
        <div className="stat-card">
          <span className="stat-label">Total de Contas</span>
          <span className="stat-value">{totalElements}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Página Atual</span>
          <span className="stat-value">{page + 1} de {totalPages}</span>
        </div>
      </div>

      <div className="accounts-grid">
        {accounts.length === 0 ? (
          <div className="empty-state">
            Nenhuma conta encontrada
          </div>
        ) : (
          accounts.map((account) => (
            <div key={account.id} className="account-card">
              <div className="account-card-header">
                <div className="account-icon">💰</div>
                <div className="account-id">Conta #{account.id}</div>
              </div>
              
              <div className="account-balance-section">
                <span className="balance-label">Saldo Disponível</span>
                <span className="balance-amount">
                  {formatCurrency(account.saldo)}
                </span>
              </div>

              <div className="account-info-row">
                <div className="info-item">
                  <span className="info-label">Usuário ID</span>
                  <span className="info-value">{account.usuarioId || '-'}</span>
                </div>
              </div>

              <button
                onClick={() => handleViewAccount(account.id)}
                className="btn-view-account"
              >
                Ver Detalhes
              </button>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={handlePreviousPage}
            disabled={page === 0}
            className="btn-pagination"
          >
            ← Anterior
          </button>
          <span className="pagination-info">
            Página {page + 1} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
            className="btn-pagination"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}

export default AccountsPage;
