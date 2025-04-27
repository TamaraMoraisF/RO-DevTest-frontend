import axios from '../api/axios';
import { PagedResult } from '../models/PagedResult';
import { Sale } from '../models/Sale';
import { SalesAnalyticsResult } from '../models/SalesAnalyticsResult';

export const getSales = async () => {
  const response = await axios.get<PagedResult<Sale>>('/api/sales', { params: { page: 1, pageSize: 10 } });
  return response.data.items || [];
};

export const getSalesAnalytics = async (startDate: string, endDate: string) => {
  const response = await axios.get<SalesAnalyticsResult>('/api/sales/analytics', {
    params: { start: startDate, end: endDate },
  });
  return response.data;
};