import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Creates a new booking',
  inputSchema: z.object({
    bookingReference: z.string(),
    customer: z.string(),
    package: z.string(),
    bookingDate: z.string().optional(),
    travelStartDate: z.string(),
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
      await zite.bookings.create({ record: input });
      return { success: true, message: 'Booking created successfully' };
    } catch (error) {
      throw error;
    }
  },
});
