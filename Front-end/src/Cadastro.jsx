import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './assets/logincadast.css';

export default function Cadastro() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }), // ✅ formato correto
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem('Cadastro realizado com sucesso!');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMensagem(data.message || 'Erro ao cadastrar');
      }
    } catch (err) {
      setMensagem('Erro ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro</h2>
      {mensagem && <p style={{ color: mensagem.includes('sucesso') ? 'green' : 'red' }}>{mensagem}</p>}
      <form onSubmit={handleCadastro}>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      <p>
        Já tem uma conta? <Link to="/login">Faça login</Link>
      </p>
    </div>
  );
}
