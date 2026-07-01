import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard', id: 'dashboard' },
    { path: '/accounts', icon: '💰', label: 'Contas', id: 'accounts' },
    { path: '/cards', icon: '💳', label: 'Cartões', id: 'cards' },
    { path: '/transactions', icon: '📱', label: 'Transações', id: 'transactions' },
    { path: '/audit-logs', icon: '🔍', label: 'Auditoria', id: 'audit' },
    { path: '/users', icon: '👥', label: 'Usuários', id: 'users' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">💎</span>
          <span className="logo-text">AcabouMony</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-version">v1.0.0</p>
      </div>
    </aside>
  );
}

export default Sidebar;
