import React from 'react';
import './assets/App.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import AirsenseIcon from './assets/imgs/Airsenseicon.png';


const umidData = [
  { dia: 'Sem1', umidade: 60 },
  { dia: 'Sem2', umidade: 62 },
  { dia: 'Sem3', umidade: 59 },
  { dia: 'Sem4', umidade: 58 },
];

export default function UmidadeQualidade() {
  const navigate = useNavigate();
  return (
    <div className="app-container" style={{ width: '100%', height: '100vh' }}>
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
        <div className="chart-card" style={{ marginTop: '1rem',maxWidth: '80%', height: '50%', margin: 'auto' }}>
      <h3>Umidade Média (semanal)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={umidData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dia" />
          <YAxis unit="%" />
          <Tooltip />
          <Legend />
          <Bar dataKey="umidade" fill="#457b9d" />
        </BarChart>
      </ResponsiveContainer>

      <section className="card" id="card-qualidade">
        <h2>Qualidade do Ar</h2>
        <p className="data">73 AQI</p>
        <p className="status warning">Atenção para pessoas sensíveis</p>
      </section>
    </div>
    </div>
  );
}
