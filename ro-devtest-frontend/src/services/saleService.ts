import axios from '../api/axios';
import { PagedResult } from '../models/PagedResult';
import { Sale } from '../models/Sale';
import { SalesAnalyticsResult } from '../models/SalesAnalyticsResult';

interface CreateSaleRequest {
  customerId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export async function createSale(sale: CreateSaleRequest): Promise<Sale> {
  const response = await axios.post<Sale>('/api/sales', sale);
  return response.data;
}

export async function getSalesAnalytics(startDate: string, endDate: string): Promise<SalesAnalyticsResult> {
  const response = await axios.get<SalesAnalyticsResult>('/api/sales/analytics', {
    params: { start: startDate, end: endDate },
  });
  return response.data;
}

export async function getSales(page: number = 1, pageSize: number = 10): Promise<PagedResult<Sale>> {
  const response = await axios.get<PagedResult<Sale>>('/api/sales', {
    params: { page, pageSize },
  });
  return response.data;
}
