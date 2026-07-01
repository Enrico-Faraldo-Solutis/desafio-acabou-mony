import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: 'Saldo Total', value: 'R$ 12.450,00', icon: '💰' },
    { label: 'Cartões', value: '3', icon: '💳' },
    { label: 'Contas', value: '2', icon: '🏦' },
    { label: 'Transações', value: '24', icon: '📊' },
  ];

  const menuItems = [
    { 
      path: '/cards', 
      icon: '💳', 
      title: 'Cartões', 
      description: 'Gerencie seus cartões virtuais e físicos',
      color: 'primary'
    },
    { 
      path: '/accounts', 
      icon: '🏦', 
      title: 'Contas', 
      description: 'Visualize e gerencie suas contas bancárias',
      color: 'success'
    },
    { 
      path: '/transactions', 
      icon: '💸', 
      title: 'Transações', 
      description: 'Consulte histórico e crie transferências',
      color: 'info'
    },
    { 
      path: '/audit-logs', 
      icon: '🔍', 
      title: 'Auditoria', 
      description: 'Logs de segurança e ações críticas',
      color: 'warning'
    },
    { 
      path: '/users', 
      icon: '👥', 
      title: 'Usuários', 
      description: 'Gerenciamento de usuários e permissões',
      color: 'secondary'
    },
  ];

  const recentActivities = [
    { icon: '💳', title: 'Novo cartão criado', time: '2 horas atrás' },
    { icon: '💸', title: 'Transferência realizada', time: '5 horas atrás' },
    { icon: '🔒', title: 'Alteração de senha', time: '1 dia atrás' },
    { icon: '📝', title: 'Documento enviado', time: '2 dias atrás' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Dashboard</h1>
          <p>Bem-vindo, {user?.username || 'Usuário'}! 👋</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn-action" onClick={() => navigate('/transactions')}>
            ➕ Nova Transação
          </button>
          <button className="btn-action" onClick={() => navigate('/cards')}>
            ➕ Novo Cartão
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="dashboard-stats">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-content">
              <h4>{stat.label}</h4>
              <div className="stat-value">{stat.value}</div>
            </div>
            <div className="stat-icon">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Main Cards Grid */}
      <div className="dashboard-grid">
        {menuItems.map((item, idx) => (
          <div 
            key={idx} 
            className="dashboard-card"
            onClick={() => navigate(item.path)}
          >
            <div className="card-header">
              <div>
                <h3 className="card-title">{item.title}</h3>
              </div>
              <div className="card-icon">{item.icon}</div>
            </div>
            <p className="card-description">{item.description}</p>
            <button className="btn-card">
              Acessar →
            </button>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Atividades Recentes</h3>
        <div className="activity-list">
          {recentActivities.map((activity, idx) => (
            <div key={idx} className="activity-item">
              <div className="activity-icon">{activity.icon}</div>
              <div className="activity-content">
                <p className="activity-title">{activity.title}</p>
                <p className="activity-time">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
