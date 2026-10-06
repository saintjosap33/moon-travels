import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Creates a new passenger for a booking',
  inputSchema: z.object({
    booking: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    gender: z.string().optional(),
    dateOfBirth: z.string().optional(),
    idType: z.string().optional(),
    idNumber: z.string().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ input }) => {
    try {
      await zite.bookingPassengers.create({ record: input });
      return { success: true, message: 'Passenger added successfully' };
    } catch (error) {
      console.error('Error creating passenger:', error);
      throw error;
    }
  },
});
