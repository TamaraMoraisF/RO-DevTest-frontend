import { useState } from 'react';
import { Customer } from '../../models/Customer';
import { createCustomer, updateCustomer, deleteCustomer } from '../../services/customerService';
import { ConfirmModal } from '../../components/ConfirmModal';
import axios from 'axios';

interface CustomerListProps {
  customers: Customer[];
  reloadCustomers: () => void;
}

export const CustomerList = ({ customers, reloadCustomers }: CustomerListProps) => {
  const [form, setForm] = useState({ name: '', email: '' });
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
      reloadCustomers();
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
        await updateCustomer({
          id: editingCustomerId,
          name: form.name,
          email: form.email,
        });
        setSuccessMessage('Customer successfully updated!');
      } else {
        await createCustomer({
          name: form.name,
          email: form.email,
        });
        setSuccessMessage('Customer successfully created!');
      }

      setForm({ name: '', email: '' });
      setEditingCustomerId(null);
      reloadCustomers();
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

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <h3>{editingCustomerId ? 'Edit Customer' : 'Create New Customer'}</h3>

        {successMessage && (
          <div style={{ color: 'green', marginBottom: '10px' }}>
            {successMessage}
          </div>
        )}

        {errorMessages.length > 0 && (
          <div style={{ color: 'red', marginBottom: '10px' }}>
            <ul style={{ paddingLeft: '20px' }}>
              {errorMessages.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
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
          <button
            type="submit"
            style={{
              marginTop: '10px',
              flex: 1,
              backgroundColor: '#6c63ff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            {editingCustomerId ? 'Update Customer' : 'Create Customer'}
          </button>

          {editingCustomerId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{
                marginTop: '10px',
                flex: 1,
                backgroundColor: '#ccc',
                color: '#333',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => handleEditClick(customer)}
                    style={{
                      backgroundColor: '#ffa500',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteClick(customer.id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};
