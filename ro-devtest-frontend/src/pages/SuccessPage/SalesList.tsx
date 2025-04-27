import { Sale } from '../../models/Sale';

interface SalesListProps {
  sales: Sale[];
}

export const SalesList = ({ sales }: SalesListProps) => (
  <>
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
  </>
);
