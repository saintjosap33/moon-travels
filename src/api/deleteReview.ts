import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Deletes a review',
  inputSchema: z.object({
    id: z.string(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ input }) => {
    try {
      await zite.reviews.delete({ id: input.id });
      return { success: true, message: 'Review deleted successfully' };
    } catch (error) {
      throw error;
    }
  },
});
