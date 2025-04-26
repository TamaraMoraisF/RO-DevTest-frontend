import { useEffect, useState } from 'react';
import { getCustomers, Customer } from '../api/customer';

export const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data.items);
      } catch (error) {
        alert('Unauthorized or error fetching customers');
        localStorage.removeItem('token'); 
        window.location.href = '/';
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div>
      <h2>Customers</h2>
      <ul>
        {customers.map(c => (
          <li key={c.id}>
            {c.name} ({c.email})
          </li>
        ))}
      </ul>
    </div>
  );
};