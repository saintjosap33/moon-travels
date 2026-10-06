import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Creates a new package',
  inputSchema: z.object({
    packageName: z.string(),
    description: z.string().optional(),
    durationDays: z.number().optional(),
    basePrice: z.number().optional(),
    packageType: z.string().optional(),
    difficultyLevel: z.string().optional(),
    isActive: z.boolean().optional(),
    maxParticipants: z.number().optional(),
    minParticipants: z.number().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ input }) => {
    try {
      await zite.travelPackages.create({ record: input });
      return { success: true, message: 'Package created successfully' };
    } catch (error) {
      throw error;
    }
  },
});
