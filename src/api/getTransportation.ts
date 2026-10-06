import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Fetches all transportation options',
  inputSchema: z.object({}),
  outputSchema: z.object({
    records: z.array(z.any()),
  }),
  execute: async () => {
    const result = await zite.transportation.findAll({ limit: 500 });
    return { records: result.records };
  },
});
