import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface SaleItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface Sale {
  id: string;
  customerName: string;
  saleDate: string;
  total: number;
  items: SaleItem[];
}

interface PagedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

interface ProductRevenueResult {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
}

interface SalesAnalyticsResult {
  totalSales: number;
  totalRevenue: number;
  productRevenueBreakdown: ProductRevenueResult[];
}

function SuccessPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [analytics, setAnalytics] = useState<SalesAnalyticsResult | null>(null);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [productsResponse, customersResponse, salesResponse] = await Promise.all([
          axios.get<PagedResult<Product>>('/api/products', { params: { page: 1, pageSize: 10 } }),
          axios.get<PagedResult<Customer>>('/api/customers', { params: { page: 1, pageSize: 10 } }),
          axios.get<PagedResult<Sale>>('/api/sales', { params: { page: 1, pageSize: 10 } }),
        ]);

        setProducts(productsResponse.data.items);
        setCustomers(customersResponse.data.items);
        setSales(salesResponse.data.items);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products, customers or sales.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const fetchAnalytics = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    try {
      const response = await axios.get<SalesAnalyticsResult>('/api/sales/analytics', {
        params: { start: startDate, end: endDate },
      });
      setAnalytics(response.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to fetch sales analytics.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="container">
      {/* PRODUCTS */}
      <h2>Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* CUSTOMERS */}
      <h2>Customers</h2>
      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* SALES */}
      <h2>Sales</h2>
      {sales.length === 0 ? (
        <p>No sales found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {sales.map(sale => (
            <div key={sale.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
              <h3>Customer: {sale.customerName}</h3>
              <p>Sale Date: {new Date(sale.saleDate).toLocaleDateString()}</p>
              <p>Total: ${sale.total.toFixed(2)}</p>

              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>${item.unitPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* ANALYTICS */}
      <h2>Sales Analytics</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          fetchAnalytics();
        }}
        style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap', justifyContent: 'center' }}>
          <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500 }}>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500 }}>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </label>
          <button type="submit" style={{ padding: '0.75rem 1.5rem' }}>
            Fetch Analytics
          </button>
        </div>
      </form>

      {analytics && (
        <div>
          <p><strong>Total Sales:</strong> {analytics.totalSales}</p>
          <p><strong>Total Revenue:</strong> ${analytics.totalRevenue.toFixed(2)}</p>

          <h3>Product Revenue Breakdown</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics.productRevenueBreakdown.map(product => (
                <tr key={product.productId}>
                  <td>{product.productName}</td>
                  <td>{product.quantitySold}</td>
                  <td>${product.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SuccessPage;
