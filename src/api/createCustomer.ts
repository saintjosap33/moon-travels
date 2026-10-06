import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Creates a new customer',
  inputSchema: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    dateOfBirth: z.string().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ input }) => {
    try {
      // Check if email already exists
      const existingCustomers = await zite.customers.findAll({
        filters: { email: input.email },
      });

      if (existingCustomers.records.length > 0) {
        return {
          success: false,
          message: 'A customer with this email already exists',
        };
      }

      await zite.customers.create({ record: input });
      return { success: true, message: 'Customer created successfully' };
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },
});
