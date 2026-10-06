import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Fetches bookings and customers data',
  inputSchema: z.object({}),
  outputSchema: z.object({
    bookings: z.array(z.any()),
    customers: z.array(z.any()),
  }),
  execute: async () => {
    const [bookingsResult, customersResult] = await Promise.all([
      zite.bookings.findAll({ limit: 500 }),
      zite.customers.findAll({ limit: 500 }),
    ]);
    return {
      bookings: bookingsResult.records,
      customers: customersResult.records,
    };
  },
});
