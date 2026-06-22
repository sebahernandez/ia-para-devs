import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Posts: archivos Markdown en src/content/posts/*.md
// El esquema valida el frontmatter en build-time (parte del contrato SSG).
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.string().default('Sebacure'),
      tags: z.array(z.string()).default([]),
      category: z.enum([
        'modelos',
        'herramientas',
        'investigacion',
        'opinión',
        'tutorial',
      ]),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
    }),
});

export const collections = { posts };