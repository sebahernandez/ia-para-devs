import { z } from 'zod';
import type { PostInput } from './types';

// Forma del JSON que envía el formulario del admin.
export const postInputSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug inválido'),
  description: z.string().min(1),
  category: z.string().min(1),
  pubDate: z.coerce.date(),
  tags: z.array(z.string()),
  author: z.string().min(1),
  draft: z.boolean(),
  featured: z.boolean(),
  content: z.string().min(1),
});

export function toPostInput(data: z.infer<typeof postInputSchema>, updatedDate: Date | null): PostInput {
  return {
    slug: data.slug,
    title: data.title,
    description: data.description,
    contentMd: data.content,
    pubDate: data.pubDate,
    updatedDate,
    author: data.author,
    categorySlug: data.category,
    draft: data.draft,
    featured: data.featured,
    tags: data.tags,
  };
}
