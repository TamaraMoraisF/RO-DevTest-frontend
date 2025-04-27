export interface ProductRevenueResult {
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
  }
  
  export interface SalesAnalyticsResult {
    totalSales: number;
    totalRevenue: number;
    productRevenueBreakdown: ProductRevenueResult[];
  }  