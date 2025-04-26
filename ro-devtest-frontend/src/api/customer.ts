import api from './axios';

export interface Customer {
  id: string;
  name: string;
  email: string;
}

export const getCustomers = async () => {
  const token = localStorage.getItem('accessToken');

  const response = await api.get('/customers', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};