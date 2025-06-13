import React from 'react';
import './assets/App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import AirsenseIcon from './assets/imgs/Airsenseicon.png';
import { useAuth } from './AuthContext.jsx';


export default function Temperatura() {
  const Navigate = useNavigate();
    const { logout } = useAuth();

  const handleLogout = () => {
  logout();
  Navigate('/login');
  }
  return (
    <div className="app-container" style={{ width: '100%', height: '100vh' }}>
              {/* HEADER */}
      <div className="header">
        <div className="logo">
          <img width="80" alt="Logo" src={AirsenseIcon} onClick={() => Navigate('/')} style={{ cursor: 'pointer' }} />
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
            <iframe
              src="/relatorios/Temperatura.pdf"
              title="Relatório Temperatura"
              width="100%"
              height="90%"
              style={{ border: 'none' }}
            />
    </div>
  );
}
