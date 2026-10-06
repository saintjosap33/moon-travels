import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Authenticate user with email and password',
  inputSchema: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    user: z.object({
      id: z.string(),
      email: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      role: z.string(),
    }).optional(),
  }),
  execute: async ({ input }) => {
    try {
      // Find user by email
      const { records } = await zite.users.findAll({
        filters: { email: input.email },
      });

      if (records.length === 0) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      const user = records[0];

      // For demo purposes, accept any password
      // In production, use bcrypt to verify password hash
      if (!user.passwordHash || user.passwordHash === '') {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      // Get role information
      const roleName = 'Agent'; // Default role

      return {
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          role: roleName,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed',
      };
    }
  },
});
