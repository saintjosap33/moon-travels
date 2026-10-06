import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Updates an existing destination',
  inputSchema: z.object({
    id: z.string(),
    destinationName: z.string().optional(),
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
      const { id, ...record } = input;
      await zite.destinations.update({ id, record });
      return { success: true, message: 'Destination updated successfully' };
    } catch (error) {
      throw error;
    }
  },
});
