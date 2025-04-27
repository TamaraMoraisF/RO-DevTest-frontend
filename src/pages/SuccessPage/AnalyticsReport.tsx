import { SalesAnalyticsResult } from '../../models/SalesAnalyticsResult';

interface AnalyticsReportProps {
  analytics: SalesAnalyticsResult | null;
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  fetchAnalytics: () => void;
}

export const AnalyticsReport = ({
  analytics,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  fetchAnalytics
}: AnalyticsReportProps) => (
  <>
    <h2>Sales Analytics</h2>

    <form
      onSubmit={e => {
        e.preventDefault();
        fetchAnalytics();
      }}
      style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap', justifyContent: 'center' }}>
        <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500 }}>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500 }}>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </label>
        <button type="submit" style={{ padding: '0.75rem 1.5rem' }}>
          Fetch Analytics
        </button>
      </div>
    </form>

    {/* Só mostra os dados se analytics existir */}
    {analytics && (
      <div>
        <p><strong>Total Sales:</strong> {analytics.totalSales}</p>
        <p><strong>Total Revenue:</strong> ${analytics.totalRevenue.toFixed(2)}</p>

        <h3>Product Revenue Breakdown</h3>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity Sold</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {analytics.productRevenueBreakdown.map(product => (
              <tr key={product.productId}>
                <td>{product.productName}</td>
                <td>{product.quantitySold}</td>
                <td>${product.revenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </>
);
