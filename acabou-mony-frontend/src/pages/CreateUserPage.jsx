import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/accountService';
import './CreateUserPage.css';

function CreateUserPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

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
      const newUser = await userService.createUser(formData);
      console.log('User created:', newUser);
      
      // Navigate to user details page
      navigate(`/users/${newUser.id}`);
    } catch (err) {
      console.error('Error creating user:', err);
      setError(
        err.response?.data?.message || 
        'Erro ao criar usuário. Verifique os dados e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  return (
    <div className="create-user-page">
      <div className="create-user-container">
        <div className="create-user-header">
          <h1>➕ Criar Novo Usuário</h1>
          <p>Preencha os dados para criar um novo usuário</p>
        </div>

        <form onSubmit={handleSubmit} className="create-user-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nome">Nome Completo *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="João da Silva"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="joao@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cpf">CPF *</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              maxLength="14"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha *</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="••••••••"
              minLength="6"
              required
              disabled={loading}
            />
            <small className="form-hint">Mínimo de 6 caracteres</small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
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
              {loading ? 'Criando...' : 'Criar Usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserPage;
