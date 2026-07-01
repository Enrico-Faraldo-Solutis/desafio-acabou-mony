import api from './api';

// Account Service - Conta endpoints
export const accountService = {
  // Create new account
  createAccount: async (usuarioId) => {
    const response = await api.post('/acabou-mony-account/contas', { usuarioId });
    return response.data;
  },

  // Get account balance by ID
  getAccountBalance: async (contaId) => {
    const response = await api.get(`/acabou-mony-account/contas/balance/${contaId}`);
    return response.data;
  },

  // Update account balance
  updateBalance: async (contaId, valor, tipoOperacao) => {
    const response = await api.put('/acabou-mony-account/contas/balance', {
      contaId,
      valor,
      tipoOperacao, // 'CREDITO' or 'DEBITO'
    });
    return response.data;
  },

  // List all accounts (paginated)
  listAllAccounts: async (page = 0, size = 10, sort = 'id') => {
    const response = await api.get('/acabou-mony-account/contas', {
      params: { page, size, sort },
    });
    return response.data;
  },
};

// User Service - Usuario endpoints
export const userService = {
  // Create new user
  createUser: async (userData) => {
    const response = await api.post('/acabou-mony-account/usuarios', userData);
    return response.data;
  },

  // List all users (paginated)
  listAllUsers: async (page = 0, size = 10, sort = 'id') => {
    const response = await api.get('/acabou-mony-account/usuarios', {
      params: { page, size, sort },
    });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/acabou-mony-account/usuarios/${id}`);
    return response.data;
  },
};

export default { accountService, userService };

