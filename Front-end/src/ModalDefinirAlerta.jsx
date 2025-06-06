import React, { useState } from 'react';
import './assets/alertas.css';

const ModalDefinirAlerta = ({ tipo, onClose, onSalvar }) => {
  const [valor, setValor] = useState('');

  const handleSalvar = () => {
    onSalvar(tipo, valor);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>Definir Alerta de {tipo}</h2>
        <input
          type="number"
          placeholder="Valor limite"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={handleSalvar}>Salvar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalDefinirAlerta;
