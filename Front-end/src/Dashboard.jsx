import './assets/App.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import ModalDefinirAlerta from './ModalDefinirAlerta';
import ModalAlerta from './Alertas';

import { useAuth } from './AuthContext.jsx';
import axios from 'axios';

import AirsenseIcon from './assets/imgs/airsenseicon.png';
import Tempicon from './assets/imgs/tempicon.png';
import Umidicon from './assets/imgs/umidicon.png';
import QualidadeIcon from './assets/imgs/qualidadeicon.png';

function App() {
  const navigate = useNavigate();

  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [tipoAlerta, setTipoAlerta] = useState('');
  const [valorAlerta, setValorAlerta] = useState('');
  const [statusAlerta, setStatusAlerta] = useState('');

  const [tempData, setTempData] = useState([]);
  const [umidData, setUmidData] = useState([]);

  const [mostrarDefinirAlerta, setMostrarDefinirAlerta] = useState(false);
  const [tipoAlertaDefinido, setTipoAlertaDefinido] = useState('');
  const [valoresAlertasDefinidos, setValoresAlertasDefinidos] = useState({});

  const abrirModalDefinirAlerta = (tipo) => {
  setTipoAlertaDefinido(tipo);
  setMostrarDefinirAlerta(true);
  };

  const salvarAlertaDefinido = (tipo, valor) => {
    setValoresAlertasDefinidos((prev) => ({
      ...prev,
      [tipo]: valor
    }));
    console.log(`Alerta definido para ${tipo}: ${valor}`);
  };

  const { logout } = useAuth();

  const handleLogout = () => {
  logout();
  navigate('/login');
  }

  useEffect(() => {
    // Buscar dados da temperatura
  axios.get('http://localhost:8080/dht11/semana-temp')
    .then(response => setTempData(response.data))
    .catch(err => console.error('Erro ao buscar temperatura:', err));

    // Buscar dados da umidade
  axios.get('http://localhost:8080/dht11/semana-umidade')
    .then(response => setUmidData(response.data))
    .catch(err => console.error('Erro ao buscar umidade:', err));
  }, []);

  useEffect(() => {

    // não faz nada se o usuário ainda não definiu nenhum alerta
    if (Object.keys(valoresAlertasDefinidos).length === 0) return;

    const alertas = [];

    // Dados simulados
    const temperatura = 28;
    const umidade = 45;
    const qualidade = 75;

    // Verificações apenas se os alertas foram definidos
    if (valoresAlertasDefinidos["Temperatura"] !== undefined && temperatura > valoresAlertasDefinidos["Temperatura"]) {
      alertas.push({ tipo: "Temperatura", valor: `${temperatura}°C`, status: "Alta" });
    }

    if (valoresAlertasDefinidos["Umidade"] !== undefined && umidade < valoresAlertasDefinidos["Umidade"]) {
      alertas.push({ tipo: "Umidade", valor: `${umidade}%`, status: "Baixa" });
    }

    if (valoresAlertasDefinidos["Qualidade do Ar"] !== undefined && qualidade > valoresAlertasDefinidos["Qualidade do Ar"]) {
      alertas.push({ tipo: "Qualidade do Ar", valor: qualidade, status: "Preocupante" });
    }


    let delay = 0;
    alertas.forEach((alerta) => {
      setTimeout(() => {
        setTipoAlerta(alerta.tipo);
        setValorAlerta(alerta.valor);
        setStatusAlerta(alerta.status);
        setMostrarAlerta(true);
      }, delay);
      delay += 4000;
    });
  }, []);

  return (
    <div className="app-container">
      {mostrarAlerta && (
        <ModalAlerta
          tipo={tipoAlerta}
          valor={valorAlerta}
          status={statusAlerta}
          onClose={() => setMostrarAlerta(false)}
        />
      )}

      {mostrarDefinirAlerta && (
        <ModalDefinirAlerta
          tipo={tipoAlertaDefinido}
          onClose={() => setMostrarDefinirAlerta(false)}
          onSalvar={salvarAlertaDefinido}
        />
      )}


      {/* HEADER */}
      <div className="header">
        <div className="logo">
          <img width="80" alt="Logo" src={AirsenseIcon} onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
        </div>
        <nav className="navbar">
          <button className="menu-toggle" onClick={() => {
            document.querySelector('.menu').classList.toggle('active');
          }}>☰</button>
          <ul className="menu">
            <li>Dashboard ⮛
              <ul className="dropdown-content">
                <li><a href="/temperatura">Temperatura</a></li>
                <li><a href="/umiqualidade">Umidade/Qualidade Ar</a></li>
              </ul>
            </li>
            <li>Relatórios ⮛
              <ul className="dropdown-content">
                <li><a href="#">Semana</a></li>
                <li><a href="#">Mês</a></li>
              </ul>
            </li>
            <li>Desenvolvedores ⮛
              <ul className="dropdown-content">
                <li><a href="https://www.linkedin.com/in/ramon-franco-155350227/">Ramon Franco</a></li>
                <li><a href="https://www.linkedin.com/in/patrícia-nogueira-dias-736146112/">Patrícia Nogueira</a></li>
                <li><a href="https://www.linkedin.com/in/vini-lemes/">Vinicius Lemes</a></li>
              </ul>
            </li>
            <li>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
                Sair
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* GRÁFICOS */}
      <div className="charts-section">
        <div className="chart-card" id="temperatura">
          <h3>Temperatura (últimos dias)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={tempData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis unit="°C" />
              <Tooltip />
              <Line type="monotone" dataKey="temp" stroke="#2a9d8f" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card" id="umidade">
          <h3>Umidade (últimos dias)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={umidData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis unit="%" />
              <Tooltip />
              <Legend />
              <Bar dataKey="umidade" fill="#457b9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid-cards">
        <section className="card" id="card-umidade">
          <div className="card-content-horizontal">
            <img width="100" alt="" src={Tempicon} onClick={() => navigate('/Temperatura')} style={{ cursor: 'pointer' }} />
            <div className="text-content">
              <h2>Temperatura</h2>
              <p className="data">28°C</p>
              <p className="status medium">Moderada</p>
              <button onClick={() => abrirModalDefinirAlerta('Temperatura')}>Definir alerta de temperatura</button>
            </div>
          </div>
        </section>

        <section className="card" id="card-umidade">
          <div className="card-content-horizontal">
            <img width="100" alt="" src={Umidicon} style={{ cursor: 'pointer' }} />
            <div className="text-content">
              <h2>Umidade</h2>
              <p className="data">58%</p>
              <p className="status medium">Moderada</p>
              <button onClick={() => abrirModalDefinirAlerta('Umidade')}>Definir alerta de umidade</button>
            </div>
          </div>
        </section>

        <section className="card" id="card-umidade">
          <div className="card-content-horizontal">
            <img width="110" alt="" src={QualidadeIcon} style={{ cursor: 'pointer' }} />
            <div className="text-content">
              <h2>Qualidade do Ar</h2>
              <p className="data">71</p>
              <p className="status medium">Preocupante</p>
              <button onClick={() => abrirModalDefinirAlerta('Qualidade do Ar')}>Definir alerta de qualidade do ar</button>
            </div>
          </div>
        </section>
      </div>

      <footer>
        <p>Atualizado em: {new Date().toLocaleString()}</p>
      </footer>
    </div>
  );
}

export default App;
