import axios from '../api/axios';
import { Customer } from '../models/Customer';
import { PagedResult } from '../models/PagedResult';

interface CreateCustomerRequest {
  name: string;
  email: string;
}

interface UpdateCustomerRequest {
  id: string;
  name: string;
  email: string;
}

export async function getCustomers(): Promise<Customer[]> {
  const response = await axios.get<PagedResult<Customer>>('/api/customers', {
    params: { page: 1, pageSize: 50 }
  });
  return response.data.items || [];
}

export async function createCustomer(customer: CreateCustomerRequest): Promise<Customer> {
  const response = await axios.post<Customer>('/api/customers', customer);
  return response.data;
}

export async function updateCustomer(customer: UpdateCustomerRequest): Promise<Customer> {
  const response = await axios.put<Customer>(`/api/customers/${customer.id}`, {
    name: customer.name,
    email: customer.email,
  });
  return response.data;
}

export async function deleteCustomer(id: string): Promise<void> {
  await axios.delete(`/api/customers/${id}`);
}
