import axios from '../api/axios';
import { Product } from '../models/Product';

interface CreateProductRequest {
  name: string;
  price: number;
}

interface UpdateProductRequest {
  id: string;
  name: string;
  price: number;
}

interface PagedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export async function createProduct(product: CreateProductRequest): Promise<Product> {
  const response = await axios.post<Product>('/api/products', product);
  return response.data;
}

export async function updateProduct(product: UpdateProductRequest): Promise<Product> {
  const response = await axios.put<Product>(`/api/products/${product.id}`, {
    name: product.name,
    price: product.price
  });
  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await axios.delete(`/api/products/${id}`);
}

export async function getProducts(page: number = 1, pageSize: number = 10): Promise<PagedResult<Product>> {
  const response = await axios.get<PagedResult<Product>>('/api/products', {
    params: { page, pageSize },
  });
  return response.data;
}