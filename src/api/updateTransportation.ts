import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Updates an existing transportation option',
  inputSchema: z.object({
    id: z.string(),
    transportType: z.string().optional(),
    providerName: z.string().optional(),
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
      const { id, ...record } = input;
      await zite.transportation.update({ id, record });
      return { success: true, message: 'Transportation updated successfully' };
    } catch (error) {
      throw error;
    }
  },
});
