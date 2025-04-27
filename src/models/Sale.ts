export interface SaleItem {
    productName: string;
    quantity: number;
    unitPrice: number;
  }
  
  export interface Sale {
    id: string;
    customerName: string;
    saleDate: string;
    total: number;
    items: SaleItem[];
  }  