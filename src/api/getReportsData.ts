import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Fetches business reports and analytics',
  inputSchema: z.object({}),
  outputSchema: z.object({
    totalBookings: z.number(),
    totalRevenue: z.number(),
    completedBookings: z.number(),
    pendingBookings: z.number(),
    cancelledBookings: z.number(),
    bookingsByStatus: z.array(z.any()),
    topPackages: z.array(z.any()),
    topCustomers: z.array(z.any()),
  }),
  execute: async () => {
    const [bookingsData, paymentsData] = await Promise.all([
      zite.bookings.findAll({ limit: 500 }),
      zite.payments.findAll({ limit: 500 }),
    ]);

    const bookings = bookingsData.records;
    const payments = paymentsData.records;

    // Status breakdown
    const statusMap = new Map();
    const statusCounts = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    bookings.forEach((b: any) => {
      const status = b.bookingStatus || 'pending';
      statusCounts[status as keyof typeof statusCounts]++;
      statusMap.set(status, (statusMap.get(status) || 0) + (b.totalPrice || 0));
    });

    const bookingsByStatus = Array.from(statusMap.entries()).map(([status, amount]) => ({
      status,
      amount,
      count: statusCounts[status as keyof typeof statusCounts],
    }));

    const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);

    // Top packages
    const packageMap = new Map();
    bookings.forEach((b: any) => {
      const pkgName = (b.package && typeof b.package === 'object' ? b.package.packageName : 'Unknown') || 'Unknown';
      packageMap.set(pkgName, (packageMap.get(pkgName) || 0) + 1);
    });
    const topPackages = Array.from(packageMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top customers
    const customerMap = new Map();
    bookings.forEach((b: any) => {
      const custName = (b.customer && typeof b.customer === 'object' ? `${b.customer.firstName} ${b.customer.lastName}` : 'Unknown') || 'Unknown';
      customerMap.set(custName, (customerMap.get(custName) || 0) + 1);
    });
    const topCustomers = Array.from(customerMap.entries())
      .map(([name, bookingCount]) => ({ name, bookingCount }))
      .sort((a, b) => b.bookingCount - a.bookingCount)
      .slice(0, 5);

    return {
      totalBookings: bookings.length,
      totalRevenue,
      completedBookings: statusCounts.completed,
      pendingBookings: statusCounts.pending,
      cancelledBookings: statusCounts.cancelled,
      bookingsByStatus,
      topPackages,
      topCustomers,
    };
  },
});
