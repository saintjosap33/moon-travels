import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Creates a new review',
  inputSchema: z.object({
    customer: z.string(),
    package: z.string(),
    rating: z.number(),
    reviewText: z.string().optional(),
    reviewDate: z.string().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ input }) => {
    try {
      await zite.reviews.create({ record: input });
      return { success: true, message: 'Review added successfully' };
    } catch (error) {
      throw error;
    }
  },
});
