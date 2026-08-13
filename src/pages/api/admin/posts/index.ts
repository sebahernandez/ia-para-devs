export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { createPost, slugExists, triggerRebuild } from '../../../../lib/admin-posts';

const postInputSchema = z.object({
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

export const POST: APIRoute = async ({ request }) => {
  const json = await request.json().catch(() => null);
  const parsed = postInputSchema.safeParse(json);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.message }), { status: 400 });
  }
  const input = parsed.data;

  if (await slugExists(input.slug)) {
    return new Response(JSON.stringify({ error: 'Ya existe un post con ese slug.' }), { status: 409 });
  }

  await createPost({
    slug: input.slug,
    title: input.title,
    description: input.description,
    contentMd: input.content,
    pubDate: input.pubDate,
    updatedDate: null,
    author: input.author,
    categorySlug: input.category,
    draft: input.draft,
    featured: input.featured,
    tags: input.tags,
  });

  if (!input.draft) await triggerRebuild();

  return new Response(JSON.stringify({ ok: true }), { status: 201 });
};
