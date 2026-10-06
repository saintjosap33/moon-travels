import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Updates an existing payment',
  inputSchema: z.object({
    id: z.string(),
    paymentReference: z.string().optional(),
    booking: z.string().optional(),
    paymentDate: z.string().optional(),
    amount: z.number().optional(),
    paymentMethod: z.string().optional(),
    paymentStatus: z.string().optional(),
    transactionReference: z.string().optional(),
    notes: z.string().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ input }) => {
    try {
      const { id, ...record } = input;
      await zite.payments.update({ id, record });
      return { success: true, message: 'Payment updated successfully' };
    } catch (error) {
      throw error;
    }
  },
});
