import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Verify2FAPage.css';

function Verify2FAPage() {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { verify2FA } = useAuth();

  const usuarioId = location.state?.usuarioId || localStorage.getItem('tempUserId');
  const message = location.state?.message;

  useEffect(() => {
    // If no usuarioId, redirect to login
    if (!usuarioId) {
      navigate('/login');
    }
  }, [usuarioId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verify2FA(usuarioId, codigo);
      console.log('2FA verification successful');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('2FA verification error:', err);
      setError(
        err.response?.data?.message || 
        'Código inválido. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    // TODO: Implement resend code functionality
    console.log('Resend code requested');
    alert('Funcionalidade de reenvio será implementada');
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <div className="verify-header">
          <div className="icon-2fa">🔐</div>
          <h1>Verificação em Duas Etapas</h1>
          <p>{message || 'Digite o código enviado para seu email'}</p>
        </div>

        <form onSubmit={handleSubmit} className="verify-form">
          <div className="form-group">
            <label htmlFor="codigo">Código de Verificação</label>
            <input
              type="text"
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="000000"
              maxLength="6"
              required
              disabled={loading}
              className="code-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Verificando...' : 'Verificar'}
          </button>
        </form>

        <div className="verify-footer">
          <p>Não recebeu o código?</p>
          <button 
            type="button" 
            className="btn-link" 
            onClick={handleResendCode}
            disabled={loading}
          >
            Reenviar código
          </button>
          <button 
            type="button" 
            className="btn-link" 
            onClick={() => navigate('/login')}
            disabled={loading}
          >
            Voltar ao login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Verify2FAPage;
