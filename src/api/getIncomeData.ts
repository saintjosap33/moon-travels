import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Fetches income and financial data',
  inputSchema: z.object({}),
  outputSchema: z.object({
    totalRevenue: z.number(),
    totalCollected: z.number(),
    outstandingAmount: z.number(),
    monthlyBreakdown: z.array(z.any()),
    byPackage: z.array(z.any()),
    byMethod: z.array(z.any()),
  }),
  execute: async () => {
    const [bookingsData, paymentsData] = await Promise.all([
      zite.bookings.findAll({ limit: 500 }),
      zite.payments.findAll({ limit: 500 }),
    ]);

    const bookings = bookingsData.records;
    const payments = paymentsData.records;

    // Calculate totals
    const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);
    const totalCollected = payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    const outstandingAmount = totalRevenue - totalCollected;

    // Monthly breakdown
    const monthlyMap = new Map();
    payments.forEach((p: any) => {
      const date = new Date(p.paymentDate);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap.set(month, (monthlyMap.get(month) || 0) + (p.amount || 0));
    });
    const monthlyBreakdown = Array.from(monthlyMap.entries())
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // By payment method
    const methodMap = new Map();
    payments.forEach((p: any) => {
      const method = p.paymentMethod || 'Unknown';
      methodMap.set(method, (methodMap.get(method) || 0) + (p.amount || 0));
    });
    const byMethod = Array.from(methodMap.entries()).map(([method, amount]) => ({
      method,
      amount,
    }));

    // By package
    const packageMap = new Map();
    bookings.forEach((b: any) => {
      const pkgId = b.package?.id || b.package || 'Unknown';
      const pkgName = (b.package && typeof b.package === 'object' ? b.package.packageName : 'Unknown') || 'Unknown';
      const key = `${pkgId}:${pkgName}`;
      packageMap.set(key, (packageMap.get(key) || 0) + (b.totalPrice || 0));
    });
    const byPackage = Array.from(packageMap.entries()).map(([key, amount]) => {
      const [, name] = key.split(':');
      return { packageName: name, amount };
    });

    return {
      totalRevenue,
      totalCollected,
      outstandingAmount,
      monthlyBreakdown,
      byPackage,
      byMethod,
    };
  },
});
