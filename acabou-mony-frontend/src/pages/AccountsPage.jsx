import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountService } from '../services/accountService';
import './AccountsPage.css';

function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await accountService.listAllAccounts(0, 100);
      console.log('Accounts response:', response);
      setAccounts(response?.content || []);
    } catch (err) {
      console.error('Erro ao carregar contas:', err);
      setError('Erro ao carregar contas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="accounts-page">
      <div className="page-header">
        <div className="page-title">
          <h1>🏦 Contas</h1>
          <p>Gerencie suas contas bancárias</p>
        </div>
        <div className="page-actions">
          <button className="btn-primary-action" onClick={() => navigate('/accounts/create')}>
            ➕ Nova Conta
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : accounts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏦</div>
          <h3>Nenhuma conta encontrada</h3>
          <p>Clique em "Nova Conta" para criar sua primeira conta</p>
        </div>
      ) : (
        <div className="cards-grid">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="card-item"
              onClick={() => navigate(`/accounts/${account.id}`)}
            >
              <div className="card-item-header">
                <h3 className="card-item-title">Conta #{account.id}</h3>
                <span className={`card-item-status ${account.ativa ? 'active' : 'inactive'}`}>
                  {account.ativa ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              <div className="card-item-content">
                <div className="card-item-row">
                  <span className="card-item-label">Titular</span>
                  <span className="card-item-value">{account.usuario?.nome || 'N/A'}</span>
                </div>
                <div className="card-item-row">
                  <span className="card-item-label">Saldo</span>
                  <span className="card-item-value">R$ {(account.saldo || 0).toFixed(2)}</span>
                </div>
                <div className="card-item-row">
                  <span className="card-item-label">Usuário ID</span>
                  <span className="card-item-value">#{account.usuario?.id || 'N/A'}</span>
                </div>
              </div>
              <div className="card-item-actions">
                <button className="btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/accounts/${account.id}`); }}>Ver Detalhes</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AccountsPage;

