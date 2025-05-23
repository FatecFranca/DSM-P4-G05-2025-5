import React from 'react';
import './assets/alertas.css';
const ModalAlerta = ({ tipo, valor, status, onClose }) => {
  if (!status) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>Alerta de {tipo}</h2>
        <p>Valor atual: <strong>{valor}</strong></p>
        <p>Status: <strong>{status}</strong></p>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default ModalAlerta;
