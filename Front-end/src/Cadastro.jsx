import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/App.css';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleCadastro = (e) => {
    e.preventDefault();
    if (nome && email && senha) {
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } else {
      alert('Preencha todos os campos!');
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro</h2>
      <form onSubmit={handleCadastro}>
        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        /><br />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        /><br />
        <button type="submit">Cadastrar</button>
      </form>
      <p>Já tem uma conta? <a href="/login">Faça login</a></p>
    </div>
  );
}

export default Cadastro;
