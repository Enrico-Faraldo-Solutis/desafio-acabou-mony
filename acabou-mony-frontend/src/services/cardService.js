import api from './api';

// Card Service - Card endpoints
export const cardService = {
  // Generate a new card for an account
  generateCard: async (cardData) => {
    const response = await api.post('/acabou-mony-card/', cardData);
    return response.data;
  },

  // List all cards
  getAllCards: async () => {
    const response = await api.get('/acabou-mony-card/');
    return response.data;
  },

  // List all cards by account ID
  listCardsByAccount: async (contaId) => {
    const response = await api.get(`/acabou-mony-card/account/${contaId}`);
    return response.data;
  },

  // Toggle card status (block/unblock)
  toggleCardStatus: async (cardId) => {
    const response = await api.put(`/acabou-mony-card/${cardId}/toggle-status`);
    return response.data;
  },
};

export default cardService;

