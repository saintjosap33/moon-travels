import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Creates a new destination',
  inputSchema: z.object({
    destinationName: z.string(),
    description: z.string().optional(),
    country: z.string().optional(),
    region: z.string().optional(),
    bestSeason: z.string().optional(),
    altitude: z.number().optional(),
    attractions: z.string().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ input }) => {
    try {
      await zite.destinations.create({ record: input });
      return { success: true, message: 'Destination created successfully' };
    } catch (error) {
      throw error;
    }
  },
});
