import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountService, userService } from '../services/accountService';
import './CreateAccountPage.css';

function CreateAccountPage() {
  const [formData, setFormData] = useState({
    usuarioId: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.listAllUsers?.(0, 100);
      setUsers(response?.content || []);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      setError('Erro ao carregar usuários.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await accountService.createAccount(parseInt(formData.usuarioId));
      navigate('/accounts', { 
        state: { 
          message: 'Conta criada com sucesso!' 
        } 
      });
    } catch (err) {
      console.error('Erro ao criar conta:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error ||
        'Erro ao criar conta. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-account-page">
      <div className="page-header">
        <div className="page-title">
          <h1>🏦 Nova Conta Bancária</h1>
          <p>Crie uma nova conta vinculada a um usuário</p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-group">
            <label htmlFor="usuarioId">Usuário *</label>
            <select
              id="usuarioId"
              name="usuarioId"
              value={formData.usuarioId}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Selecione um usuário</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nome} - {user.email} (CPF: {user.cpf})
                </option>
              ))}
            </select>
            <small className="form-help">
              A conta será criada com saldo inicial de R$ 0,00
            </small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/accounts')}
              className="btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar Conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAccountPage;