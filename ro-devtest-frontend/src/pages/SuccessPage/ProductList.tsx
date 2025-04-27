import { Product } from '../../models/Product';

interface ProductListProps {
  products: Product[];
}

export const ProductList = ({ products }: ProductListProps) => (
  <>
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
  </>
);
