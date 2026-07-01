import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import transactionService from '../services/transactionService';
import { accountService } from '../services/accountService';
import './CreateTransactionPage.css';

function CreateTransactionPage() {
  const [formData, setFormData] = useState({
    contaOrigemId: '',
    contaDestinoId: '',
    valor: '',
    tipo: 'TRANSFERENCIA'
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
      console.log('Accounts loaded for transactions:', response);
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

    // Validações
    if (parseFloat(formData.valor) <= 0) {
      setError('O valor deve ser maior que zero.');
      return;
    }

    if (formData.contaOrigemId === formData.contaDestinoId) {
      setError('A conta de origem e destino não podem ser iguais.');
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        contaOrigemId: parseInt(formData.contaOrigemId),
        contaDestinoId: parseInt(formData.contaDestinoId),
        valor: parseFloat(formData.valor),
        tipo: formData.tipo,
        usuarioId: null // Pode ser obtido do contexto de autenticação se necessário
      };
      
      console.log('Sending transaction data:', dataToSend);
      await transactionService.createTransaction(dataToSend);
      
      navigate('/transactions', { 
        state: { 
          message: 'Transação criada com sucesso!' 
        } 
      });
    } catch (err) {
      console.error('Erro ao criar transação:', err);
      console.error('Error response:', err.response?.data);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error ||
        'Erro ao criar transação. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getAccountBalance = (accountId) => {
    const account = accounts.find(acc => acc.id === parseInt(accountId));
    return account ? account.saldo : 0;
  };

  return (
    <div className="create-transaction-page">
      <div className="page-header">
        <div className="page-title">
          <h1>💸 Nova Transação</h1>
          <p>Realize uma transferência entre contas</p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-group">
            <label htmlFor="contaOrigemId">Conta de Origem *</label>
            <select
              id="contaOrigemId"
              name="contaOrigemId"
              value={formData.contaOrigemId}
              onChange={handleChange}
              required
              disabled={loading || loadingAccounts}
            >
              <option value="">
                {loadingAccounts ? 'Carregando contas...' : 'Selecione a conta de origem'}
              </option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  Conta #{account.id} - {account.usuario?.nome || 'N/A'} - Saldo: R$ {(account.saldo || 0).toFixed(2)}
                </option>
              ))}
            </select>
            {formData.contaOrigemId && (
              <small className="balance-info">
                Saldo disponível: R$ {getAccountBalance(formData.contaOrigemId).toFixed(2)}
              </small>
            )}
            {accounts.length === 0 && !loadingAccounts && (
              <small className="form-help" style={{ color: '#ef4444' }}>
                Nenhuma conta encontrada. Crie uma conta primeiro.
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="contaDestinoId">Conta de Destino *</label>
            <select
              id="contaDestinoId"
              name="contaDestinoId"
              value={formData.contaDestinoId}
              onChange={handleChange}
              required
              disabled={loading || loadingAccounts}
            >
              <option value="">
                {loadingAccounts ? 'Carregando contas...' : 'Selecione a conta de destino'}
              </option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  Conta #{account.id} - {account.usuario?.nome || 'N/A'}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="valor">Valor *</label>
            <input
              type="number"
              id="valor"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              placeholder="0.00"
              required
              disabled={loading}
              step="0.01"
              min="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo de Transação *</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="TRANSFERENCIA">Transferência</option>
              <option value="DEBITO">Débito</option>
              <option value="CREDITO">Crédito</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/transactions')}
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
              {loading ? 'Processando...' : 'Criar Transação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTransactionPage;