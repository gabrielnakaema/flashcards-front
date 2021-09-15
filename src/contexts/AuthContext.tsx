import { createContext, useContext } from 'react';
import { useEffect, useState } from 'react';
import { getUserInfo, login } from '../services/authService';
import api from '../services/api';
import { AlertContext } from './AlertContext';
import { extractErrorMessage } from '../utils/exceptions/extractMessage';

interface IAuthContext {
  isAuthenticated: boolean;
  user: {
    name?: string;
    username: string;
  } | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext({} as IAuthContext);

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IAuthContext['user']>(null);
  const isAuthenticated = !!user;
  const { setAlert } = useContext(AlertContext);

  useEffect(() => {
    const token = localStorage.getItem('flashcards-token');
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      contextGetUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextGetUserInfo = async () => {
    try {
      const response = await getUserInfo();
      if (response) {
        setUser({ username: response.username, name: response.name });
      }
    } catch (error) {
      setAlert('Token expired, please sign in again', 'error', 3000);
      localStorage.removeItem('flashcards-token');
      api.defaults.headers.Authorization = null;
    }
  };

  const contextLogin = async (username: string, password: string) => {
    try {
      const loginResponse = await login(username, password);
      localStorage.setItem('flashcards-token', loginResponse.token);
      api.defaults.headers.Authorization = `Bearer ${loginResponse.token}`;
      setUser({ username: loginResponse.username });
    } catch (error: any) {
      setAlert(extractErrorMessage(error), 'error', 3000);
    }
  };

  const logout = () => {
    api.defaults.headers.Authorization = null;
    localStorage.removeItem('flashcards-token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        logout,
        login: contextLogin,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
