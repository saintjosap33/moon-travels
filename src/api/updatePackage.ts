import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Updates an existing package',
  inputSchema: z.object({
    id: z.string(),
    packageName: z.string().optional(),
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
      const { id, ...record } = input;
      await zite.travelPackages.update({ id, record });
      return { success: true, message: 'Package updated successfully' };
    } catch (error) {
      throw error;
    }
  },
});
