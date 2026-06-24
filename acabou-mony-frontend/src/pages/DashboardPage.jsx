import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

function DashboardPage() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2>Acabou o Mony</h2>
        </div>
        <div className="nav-actions">
          <span className="user-info">Usuário ID: {user?.id}</span>
          <button onClick={handleLogout} className="btn-logout">
            Sair
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h1>🎉 Bem-vindo ao Acabou o Mony!</h1>
          <p>Você está autenticado com sucesso.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">👥</div>
            <h3>Usuários</h3>
            <p>Gerencie os usuários do sistema</p>
            <button className="btn-card" onClick={() => navigate('/users')}>
              Acessar
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">💳</div>
            <h3>Contas</h3>
            <p>Visualize e gerencie contas</p>
            <button className="btn-card" onClick={() => navigate('/accounts')}>
              Acessar
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">💰</div>
            <h3>Transações</h3>
            <p>Visualize seu histórico</p>
            <button className="btn-card">Em breve</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🔔</div>
            <h3>Notificações</h3>
            <p>Configurações de alertas</p>
            <button className="btn-card">Em breve</button>
          </div>
        </div>

        <div className="token-section">
          <h3>Seu Token JWT</h3>
          <div className="token-display">
            <code>{token}</code>
          </div>
          <p className="token-info">
            Use este token para fazer requisições autenticadas à API
          </p>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
