import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auditingService } from '../services/auditingService';
import './AuditLogDetailPage.css';

function AuditLogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLogData();
  }, [id]);

  const loadLogData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const logData = await auditingService.getLogById(id);
      setLog(logData);
    } catch (err) {
      console.error('Error loading audit log:', err);
      setError('Erro ao carregar log de auditoria.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/audit-logs');
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

  const getActionBadgeClass = (action) => {
    const actionLower = action?.toLowerCase() || '';
    if (actionLower.includes('create') || actionLower.includes('criar')) return 'badge-success';
    if (actionLower.includes('update') || actionLower.includes('atualizar')) return 'badge-info';
    if (actionLower.includes('delete') || actionLower.includes('deletar')) return 'badge-danger';
    if (actionLower.includes('login')) return 'badge-primary';
    return 'badge-default';
  };

  if (loading) {
    return (
      <div className="audit-log-detail-page">
        <div className="loading">Carregando log de auditoria...</div>
      </div>
    );
  }

  if (error || !log) {
    return (
      <div className="audit-log-detail-page">
        <div className="error-message">{error || 'Log não encontrado'}</div>
        <button onClick={handleBack} className="btn-secondary">
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="audit-log-detail-page">
      <div className="audit-log-detail-container">
        <div className="detail-header">
          <button onClick={handleBack} className="btn-back">
            ← Voltar
          </button>
          <h1>📋 Detalhes do Log de Auditoria</h1>
        </div>

        <div className="detail-card">
          {/* Header Section */}
          <div className="log-header-section">
            <div className="log-id-badge">
              Log #{log.id}
            </div>
            <span className={`action-badge-large ${getActionBadgeClass(log.acao)}`}>
              {log.acao}
            </span>
          </div>

          {/* Main Info */}
          <div className="card-section">
            <h2>Informações Principais</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">ID do Log</span>
                <span className="info-value">{log.id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Timestamp</span>
                <span className="info-value">{formatTimestamp(log.timestamp)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">ID do Usuário</span>
                <span className="info-value">{log.usuarioId || 'Não informado'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Ação</span>
                <span className="info-value">{log.acao}</span>
              </div>
            </div>
          </div>

          {/* Entity Info */}
          {(log.entidadeNome || log.entidadeId) && (
            <div className="card-section">
              <h2>Entidade Afetada</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Nome da Entidade</span>
                  <span className="info-value">{log.entidadeNome || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">ID da Entidade</span>
                  <span className="info-value">{log.entidadeId || '-'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Details Section */}
          {log.detalhes && (
            <div className="card-section">
              <h2>Detalhes Adicionais</h2>
              <div className="details-box">
                <pre>{log.detalhes}</pre>
              </div>
            </div>
          )}

          {/* Immutability Notice */}
          <div className="card-section immutability-notice">
            <div className="notice-icon">🔒</div>
            <div className="notice-content">
              <h3>Log Imutável</h3>
              <p>
                Este log de auditoria é imutável e não pode ser alterado ou excluído.
                Ele serve como registro permanente de ações críticas no sistema.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditLogDetailPage;
