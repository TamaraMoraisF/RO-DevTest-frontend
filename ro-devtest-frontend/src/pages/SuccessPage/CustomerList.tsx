import { useEffect, useState } from 'react';
import { Customer } from '../../models/Customer';
import { createCustomer, updateCustomer, deleteCustomer, getCustomers } from '../../services/customerService';
import { ConfirmModal } from '../../components/ConfirmModal';
import axios from 'axios';

export const CustomerList = ({ userRole }: { userRole: string | null }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'email'>('name');
  const [descending, setDescending] = useState(false);

  const isAdmin = userRole === 'Admin';

  useEffect(() => {
    fetchCustomers();
  }, [page, pageSize, search, sortBy, descending]);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers({ page, pageSize, search, sortBy, descending });
      setCustomers(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'name' | 'email');
  };

  const handleDescendingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescending(e.target.checked);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value > 0) {
      setPageSize(value);
      setPage(1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleEditClick = (customer: Customer) => {
    setEditingCustomerId(customer.id);
    setForm({ name: customer.name, email: customer.email });
    setSuccessMessage(null);
    setErrorMessages([]);
  };

  const handleCancelEdit = () => {
    setEditingCustomerId(null);
    setForm({ name: '', email: '' });
    setSuccessMessage(null);
    setErrorMessages([]);
  };

  const handleDeleteClick = (id: string) => {
    setCustomerIdToDelete(id);
    setConfirmModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!customerIdToDelete) return;

    setErrorMessages([]);
    setSuccessMessage(null);

    try {
      await deleteCustomer(customerIdToDelete);
      setSuccessMessage('Customer successfully deleted!');
      fetchCustomers();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const apiErrors = error.response.data?.Errors;
        if (Array.isArray(apiErrors) && apiErrors.length > 0) {
          setErrorMessages(apiErrors);
        } else {
          setErrorMessages(['An unexpected error occurred.']);
        }
      } else {
        console.error('Error deleting customer:', error);
        setErrorMessages(['Failed to delete customer.']);
      }
    } finally {
      setConfirmModalVisible(false);
      setCustomerIdToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);
    setSuccessMessage(null);

    if (!form.name || !form.email) {
      setErrorMessages(['Name and Email are required.']);
      return;
    }

    try {
      if (editingCustomerId) {
        await updateCustomer({ id: editingCustomerId, name: form.name, email: form.email });
        setSuccessMessage('Customer successfully updated!');
      } else {
        await createCustomer({ name: form.name, email: form.email });
        setSuccessMessage('Customer successfully created!');
      }

      setForm({ name: '', email: '' });
      setEditingCustomerId(null);
      fetchCustomers();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const apiErrors = error.response.data?.Errors;
        if (Array.isArray(apiErrors) && apiErrors.length > 0) {
          setErrorMessages(apiErrors);
        } else {
          setErrorMessages(['An unexpected error occurred.']);
        }
      } else {
        console.error('Error saving customer:', error);
        setErrorMessages(['Failed to save customer.']);
      }
    }
  };

  return (
    <>
      {confirmModalVisible && (
        <ConfirmModal
          message="Are you sure you want to delete this customer?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setConfirmModalVisible(false);
            setCustomerIdToDelete(null);
          }}
        />
      )}

      <h2>Customers</h2>

      <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px' }}>
        <input
          type="text"
          placeholder="Search customer names..."
          value={search}
          onChange={handleSearchChange}
          style={{ flex: '0 0 200px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />

        <select
          value={sortBy}
          onChange={handleSortChange}
          style={{ flex: '0 0 150px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        >
          <option value="name">Name</option>
          <option value="email">Email</option>
        </select>

        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="checkbox"
            checked={descending}
            onChange={handleDescendingChange}
            style={{ width: '16px', height: '16px' }}
          />
          Descending
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="number"
            value={pageSize}
            min={1}
            onChange={handlePageSizeChange}
            style={{ width: '80px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <small style={{ color: '#666' }}>Records per page</small>
        </div>
      </div>

      {isAdmin && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <h3>{editingCustomerId ? 'Edit Customer' : 'Create New Customer'}</h3>

          {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}
          {errorMessages.length > 0 && (
            <div style={{ color: 'red', marginBottom: '10px' }}>
              <ul style={{ paddingLeft: '20px' }}>
                {errorMessages.map((error, index) => <li key={index}>{error}</li>)}
              </ul>
            </div>
          )}

          <input
            name="name"
            placeholder="Customer Name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px', fontSize: '16px' }}
          />

          <input
            name="email"
            placeholder="Customer Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px', fontSize: '16px' }}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ marginTop: '10px', flex: 1, backgroundColor: '#6c63ff', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '16px', cursor: 'pointer' }}>
              {editingCustomerId ? 'Update Customer' : 'Create Customer'}
            </button>

            {editingCustomerId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{ marginTop: '10px', flex: 1, backgroundColor: '#ccc', color: '#333', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '16px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {isAdmin && <th style={{ textAlign: 'center' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  {isAdmin && (
                    <td style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button type="button" onClick={() => handleEditClick(customer)} style={{ backgroundColor: '#ffa500', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '14px', cursor: 'pointer' }}>Edit</button>
                      <button type="button" onClick={() => handleDeleteClick(customer.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '14px', cursor: 'pointer' }}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <button onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={page === totalPages}>Next</button>
          </div>
        </>
      )}
    </>
  );
};
