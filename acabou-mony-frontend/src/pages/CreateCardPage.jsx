import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cardService from '../services/cardService';
import { accountService } from '../services/accountService';
import './CreateCardPage.css';

function CreateCardPage() {
  const [formData, setFormData] = useState({
    contaId: '',
    nomeImpresso: '',
    tipo: 'CREDITO'
  });
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const response = await accountService.listAllAccounts(0, 100);
      console.log('Accounts loaded for cards:', response);
      setAccounts(response?.content || []);
    } catch (err) {
      console.error('Erro ao carregar contas:', err);
      setError('Erro ao carregar contas.');
    } finally {
      setLoadingAccounts(false);
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
      await cardService.generateCard(formData);
      navigate('/cards', { 
        state: { 
          message: 'Cartão criado com sucesso!' 
        } 
      });
    } catch (err) {
      console.error('Erro ao criar cartão:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error ||
        'Erro ao criar cartão. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-card-page">
      <div className="page-header">
        <div className="page-title">
          <h1>💳 Novo Cartão</h1>
          <p>Crie um novo cartão vinculado a uma conta</p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-group">
            <label htmlFor="contaId">Conta *</label>
            <select
              id="contaId"
              name="contaId"
              value={formData.contaId}
              onChange={handleChange}
              required
              disabled={loading || loadingAccounts}
            >
              <option value="">
                {loadingAccounts ? 'Carregando contas...' : 'Selecione uma conta'}
              </option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  Conta #{account.id} - {account.usuario?.nome || 'N/A'} - Saldo: R$ {(account.saldo || 0).toFixed(2)}
                </option>
              ))}
            </select>
            {accounts.length === 0 && !loadingAccounts && (
              <small className="form-help" style={{ color: '#ef4444' }}>
                Nenhuma conta encontrada. Crie uma conta primeiro.
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="nomeImpresso">Nome Impresso no Cartão *</label>
            <input
              type="text"
              id="nomeImpresso"
              name="nomeImpresso"
              value={formData.nomeImpresso}
              onChange={handleChange}
              placeholder="NOME COMPLETO"
              required
              disabled={loading}
              maxLength={50}
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo de Cartão *</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="CREDITO">Crédito</option>
              <option value="DEBITO">Débito</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/cards')}
              className="btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || accounts.length === 0}
            >
              {loading ? 'Criando...' : 'Criar Cartão'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCardPage;