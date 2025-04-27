import { useState } from 'react';
import { Product } from '../../models/Product';
import { createProduct, updateProduct, deleteProduct } from '../../services/productService';
import { ConfirmModal } from '../../components/ConfirmModal'; // 👈 Importa o modal
import axios from 'axios';

interface ProductListProps {
  products: Product[];
  reloadProducts: () => void;
}

export const ProductList = ({ products, reloadProducts }: ProductListProps) => {
  const [form, setForm] = useState({ name: '', price: '' });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleEditClick = (product: Product) => {
    setEditingProductId(product.id);
    setForm({ name: product.name, price: product.price.toString() });
    setSuccessMessage(null);
    setErrorMessages([]);
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setForm({ name: '', price: '' });
    setSuccessMessage(null);
    setErrorMessages([]);
  };

  const handleDeleteClick = (id: string) => {
    setProductIdToDelete(id);
    setConfirmModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!productIdToDelete) return;

    setErrorMessages([]);
    setSuccessMessage(null);

    try {
      await deleteProduct(productIdToDelete);
      setSuccessMessage('Product successfully deleted!');
      reloadProducts();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const apiErrors = error.response.data?.Errors;
        if (Array.isArray(apiErrors) && apiErrors.length > 0) {
          setErrorMessages(apiErrors);
        } else {
          setErrorMessages(['An unexpected error occurred.']);
        }
      } else {
        console.error('Error deleting product:', error);
        setErrorMessages(['Failed to delete product.']);
      }
    } finally {
      setConfirmModalVisible(false);
      setProductIdToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);
    setSuccessMessage(null);

    const parsedPrice = parseFloat(form.price);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMessages(['Please enter a valid price.']);
      return;
    }

    try {
      if (editingProductId) {
        await updateProduct({
          id: editingProductId,
          name: form.name,
          price: parsedPrice,
        });
        setSuccessMessage('Product successfully updated!');
      } else {
        await createProduct({
          name: form.name,
          price: parsedPrice,
        });
        setSuccessMessage('Product successfully created!');
      }

      setForm({ name: '', price: '' });
      setEditingProductId(null);
      reloadProducts();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const apiErrors = error.response.data?.Errors;
        if (Array.isArray(apiErrors) && apiErrors.length > 0) {
          setErrorMessages(apiErrors);
        } else {
          setErrorMessages(['An unexpected error occurred.']);
        }
      } else {
        console.error('Error saving product:', error);
        setErrorMessages(['Failed to save product.']);
      }
    }
  };

  return (
    <>
      {confirmModalVisible && (
        <ConfirmModal
          message="Are you sure you want to delete this product?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setConfirmModalVisible(false);
            setProductIdToDelete(null);
          }}
        />
      )}

      <h2>Products</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <h3>{editingProductId ? 'Edit Product' : 'Create New Product'}</h3>

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
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px', fontSize: '16px' }}
        />

        <input
          name="price"
          placeholder="Product Price"
          value={form.price}
          onChange={handleChange}
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
            {editingProductId ? 'Update Product' : 'Create Product'}
          </button>

          {editingProductId && (
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

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => handleEditClick(product)}
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
                    onClick={() => handleDeleteClick(product.id)}
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
