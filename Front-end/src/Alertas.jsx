// Alertas.jsx
import React from 'react';
import './assets/alertas.css';

const ModalAlerta = ({ tipo, valor, limiteAtual, status, onClose }) => {
  if (!status) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>⚠️ Alerta: {tipo}</h2>
        <p><strong>Valor atual:</strong> {valor}</p>
        <p><strong>Limite definido:</strong>{limiteAtual}</p>
        <p><strong>Status:</strong> {status}</p>
        <div className="modal-buttons">
          <button className="btn fechar" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalAlerta;
