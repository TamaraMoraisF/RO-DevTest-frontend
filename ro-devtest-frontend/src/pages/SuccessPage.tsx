import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import { Product } from '../models/Product';
import { Customer } from '../models/Customer';
import { Sale } from '../models/Sale';
import { SalesAnalyticsResult } from '../models/SalesAnalyticsResult';

import { getProducts } from '../services/productService';
import { getSales, getSalesAnalytics } from '../services/saleService';
import { getCustomers } from '../services/customerService';

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

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const loadCustomers = async () => {
    try {
      const customersResult = await getCustomers(1, 50);
      setCustomers(customersResult.items);
    } catch (err) {
      console.error('Error loading customers:', err);
      setError('Failed to load customers.');
    }
  };
  
  const loadProducts = async () => {
    try {
      const productsResult = await getProducts({ page: 1, pageSize: 50 });
      setProducts(productsResult.items);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products.');
    }
  };   

  const loadSales = async (pageToLoad: number) => {
    try {
      const salesResult = await getSales(pageToLoad, pageSize);
      const safeSales = salesResult.items.map((sale: Sale) => ({
        ...sale,
        items: sale.items || [],
      }));
      setSales(safeSales);
      setTotalPages(salesResult.totalPages);
    } catch (err) {
      console.error('Error loading sales:', err);
      setError('Failed to load sales.');
    }
  };  

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
          await loadProducts();
          await loadCustomers();
        }

        if (decodedToken?.role === 'Admin') {
          await loadSales(page);
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

  useEffect(() => {
    if (userRole === 'Admin') {
      loadSales(page);
    }
  }, [page]);

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
          <ProductList userRole={userRole} />
          <CustomerList userRole={userRole} />
        </>
      )}

      {userRole === 'Admin' && (
        <>
          <SalesList
            sales={sales}
            products={products}
            customers={customers}
            reloadSales={() => loadSales(page)}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
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