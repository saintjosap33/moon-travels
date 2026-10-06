import React, { useEffect, useState } from 'react';
import { getIncomeData } from 'zitejs/api';
import { toast } from 'sonner';
import { TrendingUp, DollarSign } from 'lucide-react';

export default function Income() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCollected: 0,
    outstandingAmount: 0,
    monthlyBreakdown: [] as any[],
    byPackage: [] as any[],
    byMethod: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIncome = async () => {
      try {
        setLoading(true);
        const data = await getIncomeData({});
        setStats(data);
      } catch (error) {
        console.error('Error loading income data:', error);
        toast.error('Failed to load income data');
      } finally {
        setLoading(false);
      }
    };
    loadIncome();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Income & Finance</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="dashboard-label">Total Revenue</p>
              <p className="dashboard-stat text-secondary">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="text-secondary/20" size={40} />
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="dashboard-label">Total Collected</p>
              <p className="dashboard-stat text-green-600">₹{stats.totalCollected.toLocaleString()}</p>
            </div>
            <TrendingUp className="text-green-600/20" size={40} />
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="dashboard-label">Outstanding Amount</p>
              <p className="dashboard-stat text-destructive">₹{stats.outstandingAmount.toLocaleString()}</p>
            </div>
            <DollarSign className="text-destructive/20" size={40} />
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="dashboard-card mb-8">
        <h2 className="text-xl font-bold mb-4">Monthly Income Breakdown</h2>
        {stats.monthlyBreakdown.length === 0 ? (
          <p className="text-muted-foreground">No payment data available</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {stats.monthlyBreakdown.map((item) => (
                  <tr key={item.month}>
                    <td className="font-medium">{item.month}</td>
                    <td className="font-semibold">₹{item.amount.toLocaleString()}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-secondary rounded-full" style={{ width: `${(item.amount / stats.totalCollected) * 100}%` }}></div>
                        <span className="text-sm">{((item.amount / stats.totalCollected) * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* By Payment Method */}
      <div className="dashboard-card">
        <h2 className="text-xl font-bold mb-4">Income by Payment Method</h2>
        {stats.byMethod.length === 0 ? (
          <p className="text-muted-foreground">No payment data available</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Payment Method</th>
                  <th>Amount</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {stats.byMethod.map((item) => (
                  <tr key={item.method}>
                    <td className="font-medium capitalize">{item.method}</td>
                    <td className="font-semibold">₹{item.amount.toLocaleString()}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-primary rounded-full" style={{ width: `${(item.amount / stats.totalCollected) * 100}%` }}></div>
                        <span className="text-sm">{((item.amount / stats.totalCollected) * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
