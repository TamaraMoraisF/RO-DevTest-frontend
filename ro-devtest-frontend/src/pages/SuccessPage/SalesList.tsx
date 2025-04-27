import { useState } from 'react';
import { Sale } from '../../models/Sale';
import { Product } from '../../models/Product';
import { Customer } from '../../models/Customer';
import { createSale } from '../../services/saleService';
import axios from 'axios';

interface SalesListProps {
  sales: Sale[];
  products: Product[];
  customers: Customer[];
  reloadSales: () => void;
}

export const SalesList = ({ sales, products, customers, reloadSales }: SalesListProps) => {
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: '', unitPrice: '' }]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: '', unitPrice: '' }]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);
    setSuccessMessage(null);

    const validationErrors: string[] = [];

    if (!customerId) {
      validationErrors.push('Please select a customer.');
    }

    items.forEach((item, index) => {
      const parsedQuantity = parseInt(item.quantity.toString(), 10);
      const parsedUnitPrice = parseFloat(item.unitPrice.toString());

      if (!item.productId) {
        validationErrors.push(`Please select a product for item ${index + 1}.`);
      }
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        validationErrors.push(`Please enter a valid quantity for item ${index + 1}.`);
      }
      if (isNaN(parsedUnitPrice) || parsedUnitPrice <= 0) {
        validationErrors.push(`Please enter a valid unit price for item ${index + 1}.`);
      }
    });

    if (validationErrors.length > 0) {
      setErrorMessages(validationErrors);
      return;
    }

    try {
      await createSale({
        customerId,
        items: items.map(item => ({
          productId: item.productId,
          quantity: parseInt(item.quantity.toString(), 10),
          unitPrice: parseFloat(item.unitPrice.toString()),
        })),
      });

      setSuccessMessage('Sale successfully created!');
      setCustomerId('');
      setItems([{ productId: '', quantity: '', unitPrice: '' }]);
      reloadSales();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const apiErrors = error.response.data?.Errors;
        if (Array.isArray(apiErrors) && apiErrors.length > 0) {
          setErrorMessages(apiErrors);
        } else {
          setErrorMessages(['An unexpected error occurred.']);
        }
      } else {
        console.error('Error creating sale:', error);
        setErrorMessages(['Failed to create sale.']);
      }
    }
  };

  return (
    <>
      <h2>Sales</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '12px', backgroundColor: '#fff' }}>
        <h3>Create New Sale</h3>

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

        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
          style={{
            display: 'block',
            width: '100%',
            marginBottom: '10px',
            padding: '12px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        >
          <option value="">Select Customer</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>

        {items.map((item, index) => (
          <div key={index} style={{ marginBottom: '20px', border: '1px solid #eee', padding: '10px', borderRadius: '10px', width: '100%', boxSizing: 'border-box', }}>
            <select
              value={item.productId}
              onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
              required
              style={{
                display: 'block',
                width: '100%',
                marginBottom: '8px',
                padding: '12px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid #ccc'
              }}
            >
              <option value="">Select Product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              required
              style={{
                display: 'block',
                width: '100%',
                boxSizing: 'border-box',
                marginBottom: '8px',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid #ccc'
              }}              
            />

            <input
              type="text"
              placeholder="Unit Price"
              value={item.unitPrice}
              onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
              required
              style={{
                display: 'block',
                width: '100%',
                boxSizing: 'border-box',
                marginBottom: '8px',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid #ccc'
              }}
            />

            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  width: '100%',
                  marginTop: '8px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Remove Item
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px',
            width: '100%',
            marginBottom: '10px',
            fontSize: '16px'
          }}
        >
          Add Another Product
        </button>

        <button
          type="submit"
          style={{
            backgroundColor: '#6c63ff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px',
            width: '100%',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Create Sale
        </button>
      </form>

      {sales.length === 0 ? (
        <p>No sales found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {sales.map((sale) => (
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
                  {sale.items?.map((item, idx) => (
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
    </>
  );
};
