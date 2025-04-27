import axios from '../api/axios';
import { PagedResult } from '../models/PagedResult';
import { Customer } from '../models/Customer';

export const getCustomers = async () => {
  const response = await axios.get<PagedResult<Customer>>('/api/customers', { params: { page: 1, pageSize: 10 } });
  return response.data.items || [];
};