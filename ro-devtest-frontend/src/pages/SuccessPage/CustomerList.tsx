import { Customer } from '../../models/Customer';

interface CustomerListProps {
  customers: Customer[];
}

export const CustomerList = ({ customers }: CustomerListProps) => (
  <>
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
  </>
);
