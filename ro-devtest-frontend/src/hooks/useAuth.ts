import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const navigate = useNavigate();

  const loginUser = async (username: string, password: string) => {
    try {
      const data = await login({ username: username.toUpperCase(), password });
      localStorage.setItem('accessToken', data.accessToken);
      setIsAuthenticated(true);
      navigate('/success'); 
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, loginUser, logout };
};
