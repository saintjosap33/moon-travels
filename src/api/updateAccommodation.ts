import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Updates an existing accommodation',
  inputSchema: z.object({
    id: z.string(),
    hotelName: z.string().optional(),
    city: z.string().optional(),
    hotelCategory: z.string().optional(),
    pricePerNight: z.number().optional(),
    totalRooms: z.number().optional(),
    amenities: z.array(z.string()).optional(),
    description: z.string().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ input }) => {
    try {
      const { id, ...record } = input;
      await zite.accommodations.update({ id, record });
      return { success: true, message: 'Accommodation updated successfully' };
    } catch (error) {
      throw error;
    }
  },
});
