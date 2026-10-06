import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Updates an existing booking',
  inputSchema: z.object({
    id: z.string(),
    bookingReference: z.string().optional(),
    customer: z.string().optional(),
    package: z.string().optional(),
    bookingDate: z.string().optional(),
    travelStartDate: z.string().optional(),
    passengerCount: z.number().optional(),
    totalPrice: z.number().optional(),
    bookingStatus: z.string().optional(),
    specialNotes: z.string().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ input }) => {
    try {
      const { id, ...record } = input;
      await zite.bookings.update({ id, record });
      return { success: true, message: 'Booking updated successfully' };
    } catch (error) {
      throw error;
    }
  },
});
