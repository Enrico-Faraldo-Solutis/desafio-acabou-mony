import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auditingService } from '../services/auditingService';
import './AuditLogsPage.css';

function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filters
  const [filterType, setFilterType] = useState('all'); // all, user, action, entity
  const [filterValue, setFilterValue] = useState('');
  const [entityName, setEntityName] = useState('');
  const [entityId, setEntityId] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    loadLogs();
  }, [page, filterType]);

  const loadLogs = async () => {
    setLoading(true);
    setError('');
    
    try {
      let response;
      
      switch (filterType) {
        case 'user':
          if (filterValue) {
            response = await auditingService.listLogsByUser(filterValue, page, 10);
          } else {
            response = await auditingService.listAllLogs(page, 10);
          }
          break;
        case 'action':
          if (filterValue) {
            response = await auditingService.listLogsByAction(filterValue, page, 10);
          } else {
            response = await auditingService.listAllLogs(page, 10);
          }
          break;
        case 'entity':
          if (entityName && entityId) {
            response = await auditingService.listLogsByEntity(entityName, entityId, page, 10);
          } else {
            response = await auditingService.listAllLogs(page, 10);
          }
          break;
        default:
          response = await auditingService.listAllLogs(page, 10);
      }
      
      setLogs(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      console.error('Error loading audit logs:', err);
      setError('Erro ao carregar logs de auditoria. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = () => {
    setPage(0);
    loadLogs();
  };

  const handleClearFilter = () => {
    setFilterType('all');
    setFilterValue('');
    setEntityName('');
    setEntityId('');
    setPage(0);
  };

  const handleViewLog = (logId) => {
    navigate(`/audit-logs/${logId}`);
  };

  const handlePreviousPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
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

  if (loading && logs.length === 0) {
    return (
      <div className="audit-logs-page">
        <div className="loading">Carregando logs de auditoria...</div>
      </div>
    );
  }

  return (
    <div className="audit-logs-page">
      <div className="audit-header">
        <div>
          <h1>📋 Logs de Auditoria</h1>
          <p>Visualize e filtre logs de ações críticas do sistema</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Tipo de Filtro:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos os Logs</option>
            <option value="user">Por Usuário</option>
            <option value="action">Por Ação</option>
            <option value="entity">Por Entidade</option>
          </select>
        </div>

        {filterType === 'user' && (
          <div className="filter-group">
            <label>ID do Usuário:</label>
            <input
              type="number"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder="Digite o ID do usuário"
              className="filter-input"
            />
          </div>
        )}

        {filterType === 'action' && (
          <div className="filter-group">
            <label>Ação:</label>
            <input
              type="text"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder="Ex: LOGIN, CREATE_USER"
              className="filter-input"
            />
          </div>
        )}

        {filterType === 'entity' && (
          <>
            <div className="filter-group">
              <label>Nome da Entidade:</label>
              <input
                type="text"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="Ex: Usuario, Conta"
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>ID da Entidade:</label>
              <input
                type="number"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                placeholder="Digite o ID"
                className="filter-input"
              />
            </div>
          </>
        )}

        <div className="filter-actions">
          <button onClick={handleApplyFilter} className="btn-apply">
            Aplicar Filtro
          </button>
          <button onClick={handleClearFilter} className="btn-clear">
            Limpar
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="audit-stats">
        <div className="stat-card">
          <span className="stat-label">Total de Logs</span>
          <span className="stat-value">{totalElements}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Página Atual</span>
          <span className="stat-value">{page + 1} de {totalPages}</span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="logs-table-container">
        <table className="logs-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Timestamp</th>
              <th>Usuário</th>
              <th>Ação</th>
              <th>Entidade</th>
              <th>Detalhes</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  Nenhum log encontrado
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{formatTimestamp(log.timestamp)}</td>
                  <td>{log.usuarioId || '-'}</td>
                  <td>
                    <span className={`action-badge ${getActionBadgeClass(log.acao)}`}>
                      {log.acao}
                    </span>
                  </td>
                  <td>
                    {log.entidadeNome && log.entidadeId 
                      ? `${log.entidadeNome} #${log.entidadeId}`
                      : '-'
                    }
                  </td>
                  <td className="details-cell">
                    {log.detalhes ? log.detalhes.substring(0, 50) + '...' : '-'}
                  </td>
                  <td>
                    <button
                      onClick={() => handleViewLog(log.id)}
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

      {/* Pagination */}
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

export default AuditLogsPage;
