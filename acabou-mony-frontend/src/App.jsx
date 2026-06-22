import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    setError('');

    try {
      // ATENÇÃO: O endpoint exato pode variar. Verifique seu `auth-service`.
      // A URL base vem do Gateway.
      const response = await axios.post('http://localhost:8088/api/acabou-mony-auth/login', {
        email: email,
        senha: password, // Verifique se o nome do campo é 'senha' ou 'password' na sua API
      });

      // Se a requisição for bem-sucedida, guardamos o token
      const receivedToken = response.data.token; // Ajuste 'token' se a sua API retornar com outro nome
      setToken(receivedToken);
      console.log('Login bem-sucedido! Token:', receivedToken);

      // Idealmente, você salvaria o token no localStorage aqui
      // localStorage.setItem('authToken', receivedToken);

    } catch (err) {
      console.error('Erro no login:', err);
      setError('Falha no login. Verifique suas credenciais.');
      if (err.response) {
        // O servidor respondeu com um status de erro (4xx, 5xx)
        console.error('Detalhes do erro:', err.response.data);
      }
    }
  };

  if (token) {
    return (
      <div className="App">
        <h1>Login bem-sucedido!</h1>
        <p>Seu token de acesso é: </p>
        <pre style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{token}</pre>
      </div>
    );
  }

  return (
    <div className="App">
      <form onSubmit={handleLogin}>
        <h1>Login - Acabou o Mony</h1>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default App;

