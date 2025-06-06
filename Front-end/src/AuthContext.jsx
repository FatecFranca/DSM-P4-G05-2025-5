import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Verifica se o token está expirado
  useEffect(() => {
    if (token) {
      try {
        const { exp } = jwtDecode(token); 
        const isExpired = Date.now() >= exp * 1000;

        if (isExpired) {
          logout();
        } else {
          // Define o header Authorization global do axios
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (err) {
        console.error('Token inválido:', err);
        logout();
      }
    }
  }, [token]);

  // Função de login
  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        username,
        password,
      });

      const token = response.data.replace('Bearer ', '');
      localStorage.setItem('token', token);
      setToken(token);

      // Define o header Authorization após login
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return true;
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
      return false;
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
