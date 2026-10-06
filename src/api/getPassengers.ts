import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Fetches passengers for a booking',
  inputSchema: z.object({
    bookingId: z.string(),
  }),
  outputSchema: z.object({
    records: z.array(z.any()),
  }),
  execute: async ({ input }) => {
    try {
      const result = await zite.bookingPassengers.findAll({
        filters: { booking: input.bookingId },
      });
      return { records: result.records };
    } catch (error) {
      console.error('Error fetching passengers:', error);
      throw error;
    }
  },
});
