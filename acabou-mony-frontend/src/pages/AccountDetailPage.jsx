import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { accountService } from '../services/accountService';
import './AccountDetailPage.css';

function AccountDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    valor: '',
    tipoOperacao: 'CREDITO'
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadAccountData();
  }, [id]);

  const loadAccountData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const accountData = await accountService.getAccountBalance(id);
      setAccount(accountData);
    } catch (err) {
      console.error('Error loading account:', err);
      setError('Erro ao carregar dados da conta.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/accounts');
  };

  const handleUpdateBalance = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    try {
      const updatedAccount = await accountService.updateBalance(
        id,
        parseFloat(updateForm.valor),
        updateForm.tipoOperacao
      );
      setAccount(updatedAccount);
      setShowUpdateModal(false);
      setUpdateForm({ valor: '', tipoOperacao: 'CREDITO' });
    } catch (err) {
      console.error('Error updating balance:', err);
      setError('Erro ao atualizar saldo. Tente novamente.');
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  if (loading) {
    return (
      <div className="account-detail-page">
        <div className="loading">Carregando dados da conta...</div>
      </div>
    );
  }

  if (error && !account) {
    return (
      <div className="account-detail-page">
        <div className="error-message">{error}</div>
        <button onClick={handleBack} className="btn-secondary">
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="account-detail-page">
      <div className="account-detail-container">
        <div className="detail-header">
          <button onClick={handleBack} className="btn-back">
            ← Voltar
          </button>
          <h1>💳 Detalhes da Conta</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="detail-card">
          <div className="balance-card">
            <div className="balance-header">
              <div>
                <h2>Saldo Atual</h2>
                <p className="account-number">Conta #{account.id}</p>
              </div>
              <button
                onClick={() => setShowUpdateModal(true)}
                className="btn-primary"
              >
                Atualizar Saldo
              </button>
            </div>
            <div className="balance-display">
              {formatCurrency(account.saldo)}
            </div>
          </div>

          <div className="account-details">
            <h3>Informações da Conta</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">ID da Conta</span>
                <span className="info-value">{account.id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">ID do Usuário</span>
                <span className="info-value">{account.usuarioId || 'Não associado'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showUpdateModal && (
        <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Atualizar Saldo</h2>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="btn-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateBalance} className="update-form">
              <div className="form-group">
                <label htmlFor="tipoOperacao">Tipo de Operação</label>
                <select
                  id="tipoOperacao"
                  value={updateForm.tipoOperacao}
                  onChange={(e) => setUpdateForm({ ...updateForm, tipoOperacao: e.target.value })}
                  disabled={updating}
                >
                  <option value="CREDITO">Crédito (+)</option>
                  <option value="DEBITO">Débito (-)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="valor">Valor</label>
                <input
                  type="number"
                  id="valor"
                  step="0.01"
                  min="0.01"
                  value={updateForm.valor}
                  onChange={(e) => setUpdateForm({ ...updateForm, valor: e.target.value })}
                  placeholder="0.00"
                  required
                  disabled={updating}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="btn-secondary"
                  disabled={updating}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={updating}
                >
                  {updating ? 'Atualizando...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountDetailPage;
