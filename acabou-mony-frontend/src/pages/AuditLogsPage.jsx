import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import auditingService from '../services/auditingService';
import './AuditLogsPage.css';

function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await auditingService.listAllLogs?.(0, 100);
      setLogs(response?.content || []);
    } catch (err) {
      console.error('Erro ao carregar auditoria:', err);
      setError('Erro ao carregar logs de auditoria.');
    } finally {
      setLoading(false);
    }
  };

  const getAuditIcon = (acao) => {
    if (acao?.includes('CRIAR')) return '➕';
    if (acao?.includes('ATUALIZAR')) return '✏️';
    if (acao?.includes('DELETAR')) return '🗑️';
    if (acao?.includes('LOGIN')) return '🔓';
    if (acao?.includes('LOGOUT')) return '🔒';
    if (acao?.includes('ALTERAR')) return '🔄';
    return '📝';
  };

  const getAuditColor = (acao) => {
    if (acao?.includes('DELETAR')) return 'danger';
    if (acao?.includes('CRIAR')) return 'success';
    if (acao?.includes('LOGIN')) return 'info';
    return 'warning';
  };

  return (
    <div className="audit-logs-page">
      <div className="page-header">
        <div className="page-title">
          <h1>🔍 Auditoria</h1>
          <p>Logs de segurança e ações críticas do sistema</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : logs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>Nenhum log encontrado</h3>
          <p>Não há registros de auditoria</p>
        </div>
      ) : (
        <div className="audit-logs-list">
          {logs.map((log) => (
            <div 
              key={log.id} 
              className="audit-log-item"
              onClick={() => navigate(`/audit-logs/${log.id}`)}
            >
              <div className="log-icon">{getAuditIcon(log.acao)}</div>
              <div className="log-info">
                <h4 className="log-title">{log.acao || 'Ação'}</h4>
                <div className="log-details">
                  <span className="log-user">👤 {log.usuario || 'Sistema'}</span>
                  <span className="log-entity">📦 {log.entidade || 'N/A'}</span>
                  <span className="log-time">⏰ {new Date(log.dataHora).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              <div className="log-status">
                <span className={`status-badge ${getAuditColor(log.acao)}`}>
                  {log.resultado || 'Sucesso'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AuditLogsPage;

