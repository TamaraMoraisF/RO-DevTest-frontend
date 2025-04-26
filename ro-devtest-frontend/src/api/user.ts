import api from './axios';

export interface CreateUserRequest {
  userName: string;
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  role: number;
}

export interface CreateUserResult {
  id: string;
  userName: string;
  email: string;
  name: string;
}

export const createUser = async (data: CreateUserRequest) => {
  const response = await api.post<CreateUserResult>('/api/user', data);
  return response.data;
};