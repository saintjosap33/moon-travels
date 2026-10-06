import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Creates a new payment',
  inputSchema: z.object({
    paymentReference: z.string(),
    booking: z.string(),
    paymentDate: z.string().optional(),
    amount: z.number(),
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
      await zite.payments.create({ record: input });
      return { success: true, message: 'Payment recorded successfully' };
    } catch (error) {
      throw error;
    }
  },
});
