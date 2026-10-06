import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Fetches payments and bookings data',
  inputSchema: z.object({}),
  outputSchema: z.object({
    payments: z.array(z.any()),
    bookings: z.array(z.any()),
  }),
  execute: async () => {
    const [paymentsResult, bookingsResult] = await Promise.all([
      zite.payments.findAll({ limit: 500 }),
      zite.bookings.findAll({ limit: 500 }),
    ]);
    return {
      payments: paymentsResult.records,
      bookings: bookingsResult.records,
    };
  },
});
