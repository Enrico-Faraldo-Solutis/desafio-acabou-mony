import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cardService } from '../services/cardService';
import './CardsPage.css';

function CardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchCards();

    // Check if there's a success message
    if (location.state?.message) {
      setSuccess(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    }
  }, [location]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await cardService.getAllCards();
      console.log('Cards response:', response);
      setCards(response || []);
    } catch (err) {
      console.error('Erro ao buscar cartões:', err);
      setError('Erro ao carregar cartões.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (cardId) => {
    try {
      await cardService.toggleCardStatus(cardId);
      fetchCards();
    } catch (err) {
      console.error('Erro ao alternar status:', err);
      setError('Erro ao alterar status do cartão.');
    }
  };

  return (
    <div className="cards-page">
      <div className="page-header">
        <div className="page-title">
          <h1>💳 Cartões</h1>
          <p>Gerencie seus cartões virtuais e físicos</p>
        </div>
        <div className="page-actions">
          <button className="btn-primary-action" onClick={() => navigate('/cards/create')}>
            ➕ Novo Cartão
          </button>
        </div>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : cards.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💳</div>
          <h3>Nenhum cartão encontrado</h3>
          <p>Clique em "Novo Cartão" para criar seu primeiro cartão</p>
        </div>
      ) : (
        <div className="cards-grid">
          {cards.map((card) => (
            <div 
              key={card.id} 
              className="card-item"
              onClick={() => navigate(`/cards/${card.id}`)}
            >
              <div className="card-item-header">
                <h3 className="card-item-title">**** {card.numeroCartao?.slice(-4) || 'N/A'}</h3>
                <span className={`card-item-status ${card.ativo ? 'active' : 'inactive'}`}>
                  {card.ativo ? 'Ativo' : 'Bloqueado'}
                </span>
              </div>
              <div className="card-item-content">
                <div className="card-item-row">
                  <span className="card-item-label">Titular</span>
                  <span className="card-item-value">{card.nomeImpresso || 'N/A'}</span>
                </div>
                <div className="card-item-row">
                  <span className="card-item-label">Tipo</span>
                  <span className="card-item-value">{card.tipo || 'Crédito'}</span>
                </div>
                <div className="card-item-row">
                  <span className="card-item-label">Validade</span>
                  <span className="card-item-value">{card.dataValidade || 'N/A'}</span>
                </div>
                <div className="card-item-row">
                  <span className="card-item-label">Conta</span>
                  <span className="card-item-value">#{card.contaId || 'N/A'}</span>
                </div>
              </div>
              <div className="card-item-actions">
                <button className="btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/cards/${card.id}`); }}>Ver Detalhes</button>
                <button
                  className={card.ativo ? "btn-sm-danger" : "btn-sm"}
                  onClick={(e) => { e.stopPropagation(); handleToggleStatus(card.id); }}
                >
                  {card.ativo ? 'Bloquear' : 'Desbloquear'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CardsPage;

