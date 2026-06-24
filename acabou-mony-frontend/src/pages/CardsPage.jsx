import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cardService } from '../services/cardService';
import { accountService } from '../services/accountService';
import './CardsPage.css';

function CardsPage() {
  const [cards, setCards] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    contaId: '',
    tipoCartao: 'DEBITO'
  });
  const [generating, setGenerating] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      loadCardsByAccount(selectedAccount);
    }
  }, [selectedAccount]);

  const loadAccounts = async () => {
    try {
      const response = await accountService.listAllAccounts(0, 100);
      setAccounts(response.content || []);
      if (response.content && response.content.length > 0) {
        setSelectedAccount(response.content[0].id);
      }
    } catch (err) {
      console.error('Error loading accounts:', err);
    }
  };

  const loadCardsByAccount = async (contaId) => {
    setLoading(true);
    setError('');
    
    try {
      const cardsData = await cardService.listCardsByAccount(contaId);
      setCards(cardsData || []);
    } catch (err) {
      console.error('Error loading cards:', err);
      setError('Erro ao carregar cartões. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCard = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setError('');

    try {
      await cardService.generateCard(generateForm);
      setShowGenerateModal(false);
      setGenerateForm({ contaId: '', tipoCartao: 'DEBITO' });
      
      // Reload cards for the selected account
      if (selectedAccount) {
        loadCardsByAccount(selectedAccount);
      }
    } catch (err) {
      console.error('Error generating card:', err);
      setError('Erro ao gerar cartão. Tente novamente.');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleStatus = async (cardId) => {
    try {
      await cardService.toggleCardStatus(cardId);
      
      // Reload cards
      if (selectedAccount) {
        loadCardsByAccount(selectedAccount);
      }
    } catch (err) {
      console.error('Error toggling card status:', err);
      setError('Erro ao alterar status do cartão.');
    }
  };

  const maskCardNumber = (number) => {
    if (!number) return '';
    return `**** **** **** ${number.slice(-4)}`;
  };

  const formatExpiryDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${month}/${year}`;
  };

  const getCardTypeLabel = (type) => {
    const types = {
      'DEBITO': 'Débito',
      'CREDITO': 'Crédito',
      'VIRTUAL': 'Virtual'
    };
    return types[type] || type;
  };

  const getStatusBadgeClass = (status) => {
    return status === 'ATIVO' ? 'status-active' : 'status-blocked';
  };

  return (
    <div className="cards-page">
      <div className="cards-header">
        <div>
          <h1>💳 Cartões</h1>
          <p>Gerencie os cartões virtuais</p>
        </div>
        <button 
          onClick={() => setShowGenerateModal(true)} 
          className="btn-primary"
        >
          + Gerar Novo Cartão
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Account Selector */}
      <div className="account-selector">
        <label htmlFor="account-select">Selecione uma Conta:</label>
        <select
          id="account-select"
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="account-select"
        >
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              Conta #{account.id} - Saldo: R$ {account.saldo?.toFixed(2) || '0.00'}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Carregando cartões...</div>
      ) : (
        <div className="cards-grid">
          {cards.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💳</div>
              <h3>Nenhum cartão encontrado</h3>
              <p>Gere um novo cartão para esta conta</p>
            </div>
          ) : (
            cards.map((card) => (
              <div key={card.id} className="card-item">
                <div className={`card-visual ${card.status === 'ATIVO' ? 'card-active' : 'card-blocked'}`}>
                  <div className="card-chip">💎</div>
                  <div className="card-number">{maskCardNumber(card.numeroCartao)}</div>
                  <div className="card-info">
                    <div className="card-holder">
                      <span className="label">Titular</span>
                      <span className="value">Conta #{card.contaId}</span>
                    </div>
                    <div className="card-expiry">
                      <span className="label">Validade</span>
                      <span className="value">{formatExpiryDate(card.dataValidade)}</span>
                    </div>
                  </div>
                  <div className="card-type-badge">
                    {getCardTypeLabel(card.tipoCartao)}
                  </div>
                </div>
                
                <div className="card-details">
                  <div className="detail-row">
                    <span className="detail-label">ID do Cartão:</span>
                    <span className="detail-value">#{card.id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">CVV:</span>
                    <span className="detail-value">***</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge ${getStatusBadgeClass(card.status)}`}>
                      {card.status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleStatus(card.id)}
                  className={`btn-toggle ${card.status === 'ATIVO' ? 'btn-block' : 'btn-unblock'}`}
                >
                  {card.status === 'ATIVO' ? '🔒 Bloquear' : '🔓 Desbloquear'}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Generate Card Modal */}
      {showGenerateModal && (
        <div className="modal-overlay" onClick={() => setShowGenerateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Gerar Novo Cartão</h2>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="btn-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleGenerateCard} className="generate-form">
              <div className="form-group">
                <label htmlFor="contaId">Conta</label>
                <select
                  id="contaId"
                  value={generateForm.contaId}
                  onChange={(e) => setGenerateForm({ ...generateForm, contaId: e.target.value })}
                  required
                  disabled={generating}
                >
                  <option value="">Selecione uma conta</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      Conta #{account.id} - R$ {account.saldo?.toFixed(2) || '0.00'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tipoCartao">Tipo de Cartão</label>
                <select
                  id="tipoCartao"
                  value={generateForm.tipoCartao}
                  onChange={(e) => setGenerateForm({ ...generateForm, tipoCartao: e.target.value })}
                  disabled={generating}
                >
                  <option value="DEBITO">Débito</option>
                  <option value="CREDITO">Crédito</option>
                  <option value="VIRTUAL">Virtual</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="btn-secondary"
                  disabled={generating}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={generating}
                >
                  {generating ? 'Gerando...' : 'Gerar Cartão'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardsPage;
