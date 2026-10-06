import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Fetches dashboard statistics using SQL aggregation',
  inputSchema: z.object({}),
  outputSchema: z.object({
    totalCustomers: z.number(),
    totalBookings: z.number(),
    activePackages: z.number(),
    totalRevenue: z.number(),
    outstandingPayments: z.number(),
    pendingBookings: z.number(),
    recentBookings: z.array(z.any()),
    recentPayments: z.array(z.any()),
    monthlyRevenue: z.number(),
  }),
  execute: async () => {
    try {
      // Use SQL for accurate aggregations
      const [customersResult, bookingsResult, packagesResult, paymentsResult, pendingResult, monthlyResult] = await Promise.all([
        zite.sql({
          query: `SELECT COUNT(*) as count FROM "Customers"`,
        }),
        zite.sql({
          query: `SELECT COUNT(*) as count FROM "Bookings"`,
        }),
        zite.sql({
          query: `SELECT COUNT(*) as count FROM "TravelPackages" WHERE "isActive" = true`,
        }),
        zite.sql({
          query: `SELECT COALESCE(SUM("amount"), 0) as total FROM "Payments"`,
        }),
        zite.sql({
          query: `SELECT COUNT(*) as count FROM "Bookings" WHERE "bookingStatus" = 'pending'`,
        }),
        zite.sql({
          query: `SELECT COALESCE(SUM("amount"), 0) as total FROM "Payments" WHERE DATE_TRUNC('month', "paymentDate") = DATE_TRUNC('month', NOW())`,
        }),
      ]);

      const totalCustomers = (customersResult.rows[0]?.count as number) || 0;
      const totalBookings = (bookingsResult.rows[0]?.count as number) || 0;
      const activePackages = (packagesResult.rows[0]?.count as number) || 0;
      const totalRevenue = (paymentsResult.rows[0]?.total as number) || 0;
      const pendingBookings = (pendingResult.rows[0]?.count as number) || 0;
      const monthlyRevenue = (monthlyResult.rows[0]?.total as number) || 0;

      // Get outstanding payments: sum of all booking totals minus sum of payments per booking
      const outstandingResult = await zite.sql({
        query: `
          SELECT COALESCE(SUM(b."totalPrice" - COALESCE(p_sum.total, 0)), 0) as outstanding
          FROM "Bookings" b
          LEFT JOIN (
            SELECT "bookingsId", SUM(p."amount") as total 
            FROM "BookingsPayments" bp
            JOIN "Payments" p ON bp."paymentsId" = p.id
            GROUP BY "bookingsId"
          ) p_sum ON b.id = p_sum."bookingsId"
        `,
      });
      const outstandingPayments = (outstandingResult.rows[0]?.outstanding as number) || 0;

      // Get recent bookings (last 5)
      const recentBookingsResult = await zite.bookings.findAll({
        limit: 5,
      });

      // Get recent payments (last 5)
      const recentPaymentsResult = await zite.payments.findAll({
        limit: 5,
      });

      return {
        totalCustomers,
        totalBookings,
        activePackages,
        totalRevenue,
        outstandingPayments: Math.max(0, outstandingPayments),
        pendingBookings,
        recentBookings: recentBookingsResult.records,
        recentPayments: recentPaymentsResult.records,
        monthlyRevenue,
      };
    } catch (error) {
      console.error('Error in getDashboardData:', error);
      throw error;
    }
  },
});
