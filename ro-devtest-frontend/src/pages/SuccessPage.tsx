import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import { Product } from '../models/Product';
import { Customer } from '../models/Customer';
import { Sale } from '../models/Sale';
import { SalesAnalyticsResult } from '../models/SalesAnalyticsResult';

import { getProducts } from '../services/productService';
import { getCustomers } from '../services/customerService';
import { getSales, getSalesAnalytics } from '../services/saleService';

import { ProductList } from './SuccessPage/ProductList';
import { CustomerList } from './SuccessPage/CustomerList';
import { SalesList } from './SuccessPage/SalesList';
import { AnalyticsReport } from './SuccessPage/AnalyticsReport';

function SuccessPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [analytics, setAnalytics] = useState<SalesAnalyticsResult | null>(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const decodedToken: any = jwtDecode(token);
    setUserRole(decodedToken?.role);

    const fetchData = async () => {
      try {
        if (decodedToken?.role === 'Admin' || decodedToken?.role === 'Customer') {
          const [productsData, customersData] = await Promise.all([
            getProducts(),
            getCustomers(),
          ]);

          setProducts(productsData);
          setCustomers(customersData);
        }

        if (decodedToken?.role === 'Admin') {
          const salesData = await getSales();
          setSales(salesData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
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
      const data = await getSalesAnalytics(startDate, endDate);
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to fetch analytics.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="container">
      {(userRole === 'Admin' || userRole === 'Customer') && (
        <>
          <ProductList products={products} />
          <CustomerList customers={customers} />
        </>
      )}
  
      {userRole === 'Admin' && (
      <>
        <SalesList sales={sales} />
        <AnalyticsReport
          analytics={analytics}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          fetchAnalytics={fetchAnalytics}
        />
      </>
    )}
    </div>
  );
}

export default SuccessPage;
