import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService, accountService } from '../services/accountService';
import './UserDetailPage.css';

function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserData();
  }, [id]);

  const loadUserData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const userData = await userService.getUserById(id);
      setUser(userData);
      
      // Try to find account by searching all accounts and matching usuarioId
      try {
        const accountsResponse = await accountService.listAllAccounts(0, 100);
        const userAccount = accountsResponse.content?.find(acc => acc.usuarioId === parseInt(id));
        
        if (userAccount) {
          setAccount(userAccount);
        }
      } catch (err) {
        console.log('No account found for user');
      }
    } catch (err) {
      console.error('Error loading user:', err);
      setError('Erro ao carregar dados do usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/users');
  };

  const handleViewAccount = () => {
    if (account) {
      navigate(`/accounts/${account.id}`);
    }
  };

  if (loading) {
    return (
      <div className="user-detail-page">
        <div className="loading">Carregando dados do usuário...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="user-detail-page">
        <div className="error-message">{error || 'Usuário não encontrado'}</div>
        <button onClick={handleBack} className="btn-secondary">
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="user-detail-page">
      <div className="user-detail-container">
        <div className="detail-header">
          <button onClick={handleBack} className="btn-back">
            ← Voltar
          </button>
          <h1>👤 Detalhes do Usuário</h1>
        </div>

        <div className="detail-card">
          <div className="card-section">
            <h2>Informações Pessoais</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">ID</span>
                <span className="info-value">{user.id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Nome</span>
                <span className="info-value">{user.nome}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">CPF</span>
                <span className="info-value">{user.cpf}</span>
              </div>
            </div>
          </div>

          {account && (
            <div className="card-section">
              <h2>Conta Associada</h2>
              <div className="account-info">
                <div className="account-balance">
                  <span className="balance-label">Saldo Atual</span>
                  <span className="balance-value">
                    R$ {account.saldo?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <button onClick={handleViewAccount} className="btn-primary">
                  Ver Detalhes da Conta
                </button>
              </div>
            </div>
          )}

          {!account && (
            <div className="card-section">
              <div className="no-account">
                <p>Este usuário ainda não possui uma conta associada.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDetailPage;
