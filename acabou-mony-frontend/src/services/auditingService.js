import api from './api';

// Auditing Service - Audit Log endpoints
export const auditingService = {
  // Register a new audit log (internal use)
  registerLog: async (logData) => {
    const response = await api.post('/acabou-mony-auditing/', logData);
    return response.data;
  },

  // List all audit logs (paginated)
  listAllLogs: async (page = 0, size = 10, sort = 'timestamp,desc') => {
    const response = await api.get('/acabou-mony-auditing/', {
      params: { page, size, sort },
    });
    return response.data;
  },

  // Get audit log by ID
  getLogById: async (id) => {
    const response = await api.get(`/acabou-mony-auditing/${id}`);
    return response.data;
  },

  // List logs by user ID (paginated)
  listLogsByUser: async (usuarioId, page = 0, size = 10, sort = 'timestamp,desc') => {
    const response = await api.get(`/acabou-mony-auditing/usuario/${usuarioId}`, {
      params: { page, size, sort },
    });
    return response.data;
  },

  // List logs by action (paginated)
  listLogsByAction: async (acao, page = 0, size = 10, sort = 'timestamp,desc') => {
    const response = await api.get(`/acabou-mony-auditing/acao/${acao}`, {
      params: { page, size, sort },
    });
    return response.data;
  },

  // List logs by entity (paginated)
  listLogsByEntity: async (nome, id, page = 0, size = 10, sort = 'timestamp,desc') => {
    const response = await api.get('/acabou-mony-auditing/entidade', {
      params: { nome, id, page, size, sort },
    });
    return response.data;
  },
};

export default auditingService;
