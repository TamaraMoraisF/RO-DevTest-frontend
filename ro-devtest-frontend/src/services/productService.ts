import axios from '../api/axios';
import { PagedResult } from '../models/PagedResult';
import { Product } from '../models/Product';

export const getProducts = async () => {
  const response = await axios.get<PagedResult<Product>>('/api/products', { params: { page: 1, pageSize: 10 } });
  return response.data.items || [];
};