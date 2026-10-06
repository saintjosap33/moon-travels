import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Creates a new transportation option',
  inputSchema: z.object({
    transportType: z.string(),
    providerName: z.string(),
    fromLocation: z.string().optional(),
    toLocation: z.string().optional(),
    pricePerPerson: z.number().optional(),
    capacity: z.number().optional(),
    class: z.string().optional(),
    journeyDuration: z.string().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ input }) => {
    try {
      await zite.transportation.create({ record: input });
      return { success: true, message: 'Transportation created successfully' };
    } catch (error) {
      throw error;
    }
  },
});
