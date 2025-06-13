// ModalDefinirAlerta.jsx
import './axios-interceptor.js';
import React, { useState } from 'react';
import './assets/alertas.css';
import axios from 'axios';

const ModalDefinirAlerta = ({ tipo, onClose, onSalvar }) => {
  const [valor, setValor] = useState('');

  const validaTipo = (tipo) => {
    if (tipo.toUpperCase() === "QUALIDADE DO AR") {
      return "QUALIDADE_AR";
    }
    return tipo.toUpperCase();
  };

  const handleSalvar = async () => {
    if (!valor || isNaN(valor)) {
      alert("Por favor, insira um valor válido.");
      return;
    }

    const tipoFormatado = validaTipo(tipo);
    const valorFloat = parseFloat(valor);

    try {
      await axios.post('http://172.200.143.12:8080/alertas', {
        tipo: tipoFormatado,
        valorLimite: valorFloat
      });

      if (onSalvar) onSalvar();  // permite recarregar a lista se desejar
      onClose();
    } catch (err) {
      console.error("Erro ao salvar alerta:", err);
      alert("Erro ao salvar alerta.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>Definir alerta para {tipo}</h2>
        <input
          type="number"
          min="0"
          placeholder="Digite o valor limite"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <div className="modal-buttons">
          <button className="btn salvar" onClick={handleSalvar}>Salvar</button>
          <button className="btn cancelar" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalDefinirAlerta;
