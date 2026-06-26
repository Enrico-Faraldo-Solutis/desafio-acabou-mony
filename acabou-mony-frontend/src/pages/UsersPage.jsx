import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/accountService';
import './UsersPage.css';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, [page]);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await userService.listAllUsers(page, 10, 'id');
      setUsers(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Erro ao carregar usuários. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (userId) => {
    navigate(`/users/${userId}`);
  };

  const handleCreateUser = () => {
    navigate('/users/create');
  };

  const handlePreviousPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  if (loading) {
    return (
      <div className="users-page">
        <div className="loading">Carregando usuários...</div>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>👥 Usuários</h1>
          <p>Gerencie os usuários do sistema</p>
        </div>
        <button onClick={handleCreateUser} className="btn-primary">
          + Novo Usuário
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="users-stats">
        <div className="stat-card">
          <span className="stat-label">Total de Usuários</span>
          <span className="stat-value">{totalElements}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Página Atual</span>
          <span className="stat-value">{page + 1} de {totalPages}</span>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>CPF</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nome}</td>
                  <td>{user.email}</td>
                  <td>{user.cpf}</td>
                  <td>
                    <button
                      onClick={() => handleViewUser(user.id)}
                      className="btn-view"
                    >
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={handlePreviousPage}
            disabled={page === 0}
            className="btn-pagination"
          >
            ← Anterior
          </button>
          <span className="pagination-info">
            Página {page + 1} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
            className="btn-pagination"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
