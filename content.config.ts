import { defineCollection, defineContentConfig, z } from '@nuxt/content';

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        tags: z.array(z.string()),
        image: z.string(),
        imageAlt: z.string().optional(),
        published: z.boolean().optional(),
        keywords: z.array(z.string()).optional(),
      }),
    }),
  },
});
