import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Creates a new accommodation',
  inputSchema: z.object({
    hotelName: z.string(),
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
      await zite.accommodations.create({ record: input });
      return { success: true, message: 'Accommodation created successfully' };
    } catch (error) {
      throw error;
    }
  },
});
