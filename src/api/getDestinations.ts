import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Fetches all destinations',
  inputSchema: z.object({}),
  outputSchema: z.object({
    records: z.array(z.any()),
  }),
  execute: async () => {
    const result = await zite.destinations.findAll({ limit: 500 });
    return { records: result.records };
  },
});
