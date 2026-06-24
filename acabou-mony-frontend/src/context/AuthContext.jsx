import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const storedToken = authService.getToken();
    const storedUserId = localStorage.getItem('userId');
    
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUser({ id: storedUserId });
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await authService.login(email, senha);
      // Store userId temporarily for 2FA verification
      localStorage.setItem('tempUserId', response.usuarioId);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const verify2FA = async (usuarioId, codigo) => {
    try {
      const response = await authService.verify2FA(usuarioId, codigo);
      const { token } = response;
      
      // Store token and user info
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', usuarioId);
      localStorage.removeItem('tempUserId');
      
      setToken(token);
      setUser({ id: usuarioId });
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    localStorage.removeItem('tempUserId');
  };

  const value = {
    user,
    token,
    loading,
    login,
    verify2FA,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
