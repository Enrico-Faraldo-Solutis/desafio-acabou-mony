import axios from 'axios';

const API_BASE_URL = 'http://localhost:8088/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: async (email, senha) => {
    const response = await api.post('/acabou-mony-auth/login', { email, senha });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/acabou-mony-account/usuarios', userData);
    return response.data;
  },

  verify2FA: async (usuarioId, codigo) => {
    const response = await api.post('/acabou-mony-auth/verify-2fa', { usuarioId, codigo });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

export default api;

