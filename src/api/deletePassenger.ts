import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Deletes a passenger',
  inputSchema: z.object({
    id: z.string(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ input }) => {
    try {
      await zite.bookingPassengers.delete({ id: input.id });
      return { success: true, message: 'Passenger deleted successfully' };
    } catch (error) {
      console.error('Error deleting passenger:', error);
      throw error;
    }
  },
});
