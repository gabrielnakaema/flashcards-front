import api from './api';

interface NewUser {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface APILoginResponse {
  token: string;
  username: string;
}

export const login = async (username: string, password: string) => {
  const response = await api.post<APILoginResponse>('/v1/auth/login', {
    username,
    password,
  });
  return response.data;
};

export const register = async (newUser: NewUser) => {
  const response = await api.post('/v1/auth/signup', newUser);
  return response.data;
};

export const getUserInfo = async () => {
  const response = await api.get('/v1/user/me');
  return response.data;
};
