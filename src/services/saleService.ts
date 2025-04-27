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

interface GetSalesParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  descending?: boolean;
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

export async function getSales(params: GetSalesParams = {}): Promise<PagedResult<Sale>> {
  const { page = 1, pageSize = 10, sortBy = 'saleDate', descending = false } = params;

  const response = await axios.get<PagedResult<Sale>>('/api/sales', {
    params: { page, pageSize, sortBy, descending },
  });

  return response.data;
}
