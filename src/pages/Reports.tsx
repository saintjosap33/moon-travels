import React, { useEffect, useState } from 'react';
import { getReportsData } from 'zitejs/api';
import { toast } from 'sonner';

export default function Reports() {
  const [reportData, setReportData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    completedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    bookingsByStatus: [] as any[],
    topPackages: [] as any[],
    topCustomers: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const data = await getReportsData({});
        setReportData(data);
      } catch (error) {
        console.error('Error loading reports:', error);
        toast.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    loadReports();
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
      <h1 className="text-3xl font-bold text-foreground mb-8">Reports</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="dashboard-card">
          <p className="dashboard-label">Total Bookings</p>
          <p className="dashboard-stat">{reportData.totalBookings}</p>
        </div>
        <div className="dashboard-card">
          <p className="dashboard-label">Total Revenue</p>
          <p className="dashboard-stat text-secondary">₹{reportData.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="dashboard-card">
          <p className="dashboard-label">Completed</p>
          <p className="dashboard-stat text-green-600">{reportData.completedBookings}</p>
        </div>
        <div className="dashboard-card">
          <p className="dashboard-label">Pending</p>
          <p className="dashboard-stat text-yellow-600">{reportData.pendingBookings}</p>
        </div>
      </div>

      {/* Bookings by Status */}
      <div className="dashboard-card">
        <h2 className="text-xl font-bold mb-4">Bookings by Status</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Count</th>
                <th>Revenue</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {reportData.bookingsByStatus.map((item) => (
                <tr key={item.status}>
                  <td className="capitalize font-medium">{item.status}</td>
                  <td>{item.count}</td>
                  <td className="font-semibold">₹{item.amount.toLocaleString()}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-primary rounded-full" style={{ width: `${(item.count / reportData.totalBookings) * 100}%` }}></div>
                      <span className="text-sm">{((item.count / reportData.totalBookings) * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
