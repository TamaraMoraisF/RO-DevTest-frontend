import api from './axios';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  issuedAt: string;
  expirationDate: string;
  roles: string[];
}

export const login = async (data: LoginRequest) => {
  const response = await api.post<LoginResponse>('/api/auth/login', data); 
  return response.data;
};