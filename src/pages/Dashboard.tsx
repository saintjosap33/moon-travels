import React, { useEffect, useState } from 'react';
import { getDashboardData } from 'zitejs/api';
import { TrendingUp, Users, Package, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalBookings: 0,
    activePackages: 0,
    totalRevenue: 0,
    outstandingPayments: 0,
    pendingBookings: 0,
    recentBookings: [] as any[],
    recentPayments: [] as any[],
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getDashboardData({});
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="dashboard-label">Total Customers</p>
              <p className="dashboard-stat">{stats.totalCustomers}</p>
            </div>
            <Users className="text-primary/20" size={40} />
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="dashboard-label">Total Bookings</p>
              <p className="dashboard-stat">{stats.totalBookings}</p>
            </div>
            <Package className="text-primary/20" size={40} />
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="dashboard-label">Active Packages</p>
              <p className="dashboard-stat">{stats.activePackages}</p>
            </div>
            <TrendingUp className="text-primary/20" size={40} />
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="dashboard-label">Total Revenue</p>
              <p className="dashboard-stat">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="text-secondary/20" size={40} />
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="dashboard-label">Outstanding Payments</p>
              <p className="dashboard-stat text-destructive">₹{stats.outstandingPayments.toLocaleString()}</p>
            </div>
            <AlertCircle className="text-destructive/20" size={40} />
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="dashboard-label">Pending Bookings</p>
              <p className="dashboard-stat">{stats.pendingBookings}</p>
            </div>
            <CheckCircle className="text-secondary/20" size={40} />
          </div>
        </div>
      </div>

      {/* Monthly Revenue */}
      <div className="dashboard-card mb-8">
        <h2 className="text-xl font-bold mb-4">Current Month Revenue</h2>
        <p className="text-4xl font-bold text-secondary mb-2">₹{stats.monthlyRevenue.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">Total income this month</p>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
          {stats.recentBookings.length === 0 ? (
            <p className="text-muted-foreground">No bookings yet</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="font-mono text-sm">{booking.bookingReference}</td>
                      <td>
                        <span className={`badge badge-${booking.bookingStatus === 'confirmed' ? 'success' : booking.bookingStatus === 'pending' ? 'warning' : 'primary'}`}>
                          {booking.bookingStatus}
                        </span>
                      </td>
                      <td className="font-semibold">₹{booking.totalPrice?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4">Recent Payments</h2>
          {stats.recentPayments.length === 0 ? (
            <p className="text-muted-foreground">No payments yet</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Method</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="font-mono text-sm">{payment.paymentReference}</td>
                      <td className="text-sm">{payment.paymentMethod}</td>
                      <td className="font-semibold">₹{payment.amount?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
