import api from './api';

// Transaction Service - Transaction endpoints
export const transactionService = {
  // Create a new transaction
  createTransaction: async (transactionData) => {
    const response = await api.post('/acabou-mony-transaction/transacoes', transactionData);
    return response.data;
  },

  // Get transaction by ID
  getTransactionById: async (id) => {
    const response = await api.get(`/acabou-mony-transaction/transacoes/${id}`);
    return response.data;
  },

  // Get all transactions by account ID
  getTransactionsByAccount: async (contaId) => {
    const response = await api.get(`/acabou-mony-transaction/transacoes/conta/${contaId}`);
    return response.data;
  },

  // Get all transactions
  getAllTransactions: async () => {
    const response = await api.get('/acabou-mony-transaction/transacoes');
    return response.data;
  },
};

export default transactionService;
