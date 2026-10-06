import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Deletes a transportation option',
  inputSchema: z.object({
    id: z.string(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ input }) => {
    try {
      await zite.transportation.delete({ id: input.id });
      return { success: true, message: 'Transportation deleted successfully' };
    } catch (error) {
      throw error;
    }
  },
});
