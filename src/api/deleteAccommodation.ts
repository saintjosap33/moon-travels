import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Deletes an accommodation',
  inputSchema: z.object({
    id: z.string(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ input }) => {
    try {
      await zite.accommodations.delete({ id: input.id });
      return { success: true, message: 'Accommodation deleted successfully' };
    } catch (error) {
      throw error;
    }
  },
});
