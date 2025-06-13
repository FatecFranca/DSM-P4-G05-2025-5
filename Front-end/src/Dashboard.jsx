import './assets/App.css';
import './axios-interceptor.js';
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

import AirsenseIcon from './assets/imgs/Airsenseicon.png';
import Tempicon from './assets/imgs/Tempicon.png';
import Umidicon from './assets/imgs/umidicon.png';
import QualidadeIcon from './assets/imgs/qualidadeicon.png';

function App() {
  const navigate = useNavigate();

  const [ultimaTemperatura, setUltimaTemperatura] = useState(null);
  const [ultimaUmidade, setUltimaUmidade] = useState(null);
  const [ultimaQualidade, setUltimaQualidade] = useState(null);

  const [tipoAlerta, setTipoAlerta] = useState("");
  const [valorAlerta, setValorAlerta] = useState(null);
  const [statusAlerta, setStatusAlerta] = useState("");

  
  const [tempData, setTempData] = useState([]);
  const [umidData, setUmidData] = useState([]);
  
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mostrarDefinirAlerta, setMostrarDefinirAlerta] = useState(false);
  const [limiteAlerta, setLimiteAlerta] = useState(null);


  const [alertasConfigurados, setAlertasConfigurados] = useState([]);
  const [tipoAlertaDefinido, setTipoAlertaDefinido] = useState("");
  const [inputValor, setInputValor] = useState("");

  const abrirModalDefinirAlerta = (tipo) => {
     setTipoAlertaDefinido(validaAlerta(tipo));

    const alertaExistente = alertasConfigurados.find(
      (a) => a.tipo === tipo.toUpperCase().replace(" ", "_")
    );
    setInputValor(alertaExistente?.valorLimite?.toString() || "");
    setMostrarDefinirAlerta(true);
  };

  const validaAlerta = (tipo) => {
    if (tipo.toUpperCase() == "QUALIDADE DO AR") {
      return "QUALIDADE_AR";
    }
    return tipo;
  };

  const fetchAlertas = async () => {
    try {
      const res = await axios.get("http://172.200.143.12:8080/alertas");
      setAlertasConfigurados(res.data);
    } catch (err) {
      console.error("Erro ao buscar alertas:", err);
    }
  };
  const buscarLimite = (tipo) => {
    const alerta = alertasConfigurados.find((a) => a.tipo === tipo);
    return alerta?.valorLimite;
  };

  const getStatus = (tipo, valorAtual) => {
    const limite = buscarLimite(tipo);
    if (limite === undefined) return null;
    return valorAtual < limite ? "Dentro da faixa" : "Fora da faixa";
  };

  const statusTemperatura = getStatus("TEMPERATURA", ultimaTemperatura);
  const statusUmidade = getStatus("UMIDADE", ultimaUmidade);
  const statusQualidade = getStatus("QUALIDADE_AR", ultimaQualidade);
  
  const { logout } = useAuth();

  const handleLogout = () => {
  logout();
  navigate('/login');
  }

  const [alertasAtivos, setAlertasAtivos] = useState({});
  const [cooldowns, setCooldowns] = useState({});

  
useEffect(() => {
  const verificarAlertas = (tipo, valor) => {
    const limite = buscarLimite(tipo);
    if (limite === undefined) return;

    const agora = Date.now();
    const cooldownAtivo = cooldowns[tipo] && cooldowns[tipo] > agora;

    if (valor > limite) {
      if (!alertasAtivos[tipo] && !cooldownAtivo) {
        setTipoAlerta(tipo);
        setValorAlerta(valor);
        setLimiteAlerta(limite);
        setStatusAlerta("Fora da faixa");
        setMostrarAlerta(true);

        setAlertasAtivos(prev => ({ ...prev, [tipo]: true }));


        setCooldowns(prev => ({
          ...prev,
          [tipo]: agora + 30000
        }));
      }
    } else {
      if (alertasAtivos[tipo]) {
        setAlertasAtivos(prev => {
          const copy = { ...prev };
          delete copy[tipo];
          return copy;
        });
      }
    }
  };

  if (ultimaTemperatura !== null) verificarAlertas("TEMPERATURA", ultimaTemperatura);
  if (ultimaUmidade !== null) verificarAlertas("UMIDADE", ultimaUmidade);
  if (ultimaQualidade !== null) verificarAlertas("QUALIDADE_AR", ultimaQualidade);


},[ultimaTemperatura, ultimaUmidade, ultimaQualidade, alertasConfigurados, alertasAtivos]);


useEffect(() => {
  fetchAlertas();

    // Buscar dados da temperatura
    ////
  axios.get('http://172.200.143.12:8080/dht11/semana-temp')
    .then(response => setTempData(response.data))
    .catch(err => console.error('Erro ao buscar temperatura:', err));

    // Buscar dados da umidade
    ////
  axios.get('http://172.200.143.12:8080/dht11/semana-umidade')
    .then(response => setUmidData(response.data))
    .catch(err => console.error('Erro ao buscar umidade:', err));

  axios
    .get("http://172.200.143.12:8080/dht11?limit=1")
    .then((res) => {
      const ultimo = res.data[0];
      if (ultimo) {
        setUltimaTemperatura(ultimo.temperatura);
        setUltimaUmidade(ultimo.umidade);
      }
    })
    .catch((err) => console.error("Erro ao buscar último dht11:", err));

  axios
    .get("http://172.200.143.12:8080/mq9?limit=1")
    .then((res) => {
      const ultimo = res.data[0];
      if (ultimo) {
        setUltimaQualidade(ultimo.ppm);
      }
    })
    .catch((err) => console.error("Erro ao buscar último mq9:", err));
}, []);
    
  return (
    <div className="app-container">
      {mostrarAlerta && (
        <ModalAlerta
          tipo={tipoAlerta}
          valor={valorAlerta}
          limiteAtual={limiteAlerta}
          status={statusAlerta}
          onClose={() => setMostrarAlerta(false)}
        />
      )}

      {mostrarDefinirAlerta && (
        <ModalDefinirAlerta
          tipo={tipoAlertaDefinido}
          onClose={() => setMostrarDefinirAlerta(false)}
          onSalvar={fetchAlertas} // recarrega alertas após salvar
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
                <li><a href="/umiqualidade">Umidade Ar</a></li>
              </ul>
            </li>
            <li>Relatórios ⮛
              <ul className="dropdown-content">
                <li><a href="/relatorios/AnalisePi.pbix" download>PowerBi</a></li>
                <li><a href="/relatorios/AnalisePi.pdf" download>PDF</a></li>
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
              <p className="data">{ultimaTemperatura !== null ? `${ultimaTemperatura}°C` : "--"}</p>
              <p className="status medium">{statusTemperatura}</p>
              <button onClick={() => abrirModalDefinirAlerta('Temperatura')}>Definir alerta de temperatura</button>
            </div>
          </div>
        </section>

        <section className="card" id="card-umidade">
          <div className="card-content-horizontal">
            <img width="100" alt="" src={Umidicon} style={{ cursor: 'pointer' }} />
            <div className="text-content">
              <h2>Umidade</h2>
              <p className="data">{ultimaUmidade !== null ? `${ultimaUmidade}%` : "--"}</p>
              <p className="status medium">{statusUmidade}</p>
              <button onClick={() => abrirModalDefinirAlerta('Umidade')}>Definir alerta de umidade</button>
            </div>
          </div>
        </section>

        <section className="card" id="card-umidade">
          <div className="card-content-horizontal">
            <img width="110" alt="" src={QualidadeIcon} style={{ cursor: 'pointer' }} />
            <div className="text-content">
              <h2>Qualidade do Ar</h2>
              <p className="data">{ultimaQualidade !== null ? ultimaQualidade : "--"}</p>
              <p className="status medium">{statusQualidade}</p>
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
