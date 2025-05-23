import './assets/App.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ModalAlerta from './Alertas';
import AirsenseIcon from './assets/imgs/Airsenseicon.png';
import Tempicon from './assets/imgs/tempicon.png';
import Umidicon from './assets/imgs/umidicon.png';
import QualidadeIcon from './assets/imgs/qualidadeicon.png';


const tempData = [
  { dia: 'Seg', temp: 24 },
  { dia: 'Ter', temp: 26 },
  { dia: 'Qua', temp: 25 },
  { dia: 'Qui', temp: 27 },
  { dia: 'Sex', temp: 28 },
  { dia: 'Sáb', temp: 29 },
  { dia: 'Dom', temp: 26 }
];

const umidData = [
  { dia: 'Sem1', umidade: 60 },
  { dia: 'Sem2', umidade: 62 },
  { dia: 'Sem3', umidade: 59 },
  { dia: 'Sem4', umidade: 58 },
];

function App() {
  const navigate = useNavigate();

  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [tipoAlerta, setTipoAlerta] = useState('');
  const [valorAlerta, setValorAlerta] = useState('');
  const [statusAlerta, setStatusAlerta] = useState('');

    useEffect(() => {
    // valores simulados (você pode pegar direto de algum state futuramente)
    const temperatura = 28;
    const umidade = 58;
    const qualidade = 71;

    if (temperatura > 27) {
      setTipoAlerta('Temperatura');
      setValorAlerta(`${temperatura}°C`);
      setStatusAlerta('Alta');
      setMostrarAlerta(true);
    } else if (umidade < 50) {
      setTipoAlerta('Umidade');
      setValorAlerta(`${umidade}%`);
      setStatusAlerta('Baixa');
      setMostrarAlerta(true);
    } else if (qualidade > 70) {
      setTipoAlerta('Qualidade do Ar');
      setValorAlerta(qualidade);
      setStatusAlerta('Preocupante');
      setMostrarAlerta(true);
    }
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
      <div className="header">
        <div className="logo">
          <img width="80" loading="lazy" alt="Logo" src={AirsenseIcon} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}></img>
        </div>
        <nav className="navbar">
          <button className="menu-toggle" onClick={() => {
            document.querySelector('.menu').classList.toggle('active');
          }}>
            ☰
          </button>
          <ul className="menu">
            <li>
              Dashboard ⮛
              <ul className="dropdown-content">
                <li><a href="/temperatura">Temperatura</a></li>
                <li><a href="/umidade-qualidade">Umidade/Qualidade Ar</a></li>
              </ul>
            </li>
            <li>
              Relatórios ⮛
              <ul className="dropdown-content">
                <li><a href="#">Semana</a></li>
                <li><a href="#">Mês</a></li>
              </ul>
            </li>
            <li>
              Desenvolvedores ⮛
              <ul className="dropdown-content">
                <li><a href="https://www.linkedin.com/in/ramon-franco-155350227/">Ramon Franco</a></li>
                <li><a href="https://www.linkedin.com/in/patrícia-nogueira-dias-736146112/">Patrícia Nogueira</a></li>
                <li><a href="https://www.linkedin.com/in/vini-lemes/">Vinicius Lemes</a></li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>

      <div className="charts-section">
        <div className="chart-card" id="temperatura">
          <h3>Temperatura (últimos 7 dias)</h3>
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
          <h3>Umidade Média (semanal)</h3>
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

      <div className="grid-cards">
        <section className="card" id="card-umidade">
          <div className="card-content-horizontal">
            <img
              width="100"
              loading="lazy"
              alt=""
              src={Tempicon}
              onClick={() => navigate('/Temperatura')}
              style={{ cursor: 'pointer' }}
            />
            <div className="text-content">
              <h2>Temperatura</h2>
              <p className="data">28Cº</p>
              <p className="status medium">Moderada</p>
            </div>
          </div>
        </section>

        <section className="card" id="card-umidade">
          <div className="card-content-horizontal">
            <img
              width="100"
              loading="lazy"
              alt=""
              src={Umidicon}
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            />
            <div className="text-content">
              <h2>Umidade</h2>
              <p className="data">58%</p>
              <p className="status medium">Moderada</p>
            </div>
          </div>
        </section>

        <section className="card" id="card-umidade">
          <div className="card-content-horizontal">
            <img
              width="110"
              loading="lazy"
              alt=""
              src={QualidadeIcon}
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            />
            <div className="text-content">
              <h2>Qualidade do Ar</h2>
              <p className="data">71</p>
              <p className="status medium">Preocupante</p>
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
