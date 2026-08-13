export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { deletePost, slugExists, triggerRebuild, updatePost } from '../../../../lib/admin-posts';

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

export const PUT: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return new Response(JSON.stringify({ error: 'ID inválido' }), { status: 400 });
  }

  const json = await request.json().catch(() => null);
  const parsed = postInputSchema.safeParse(json);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.message }), { status: 400 });
  }
  const input = parsed.data;

  if (await slugExists(input.slug, id)) {
    return new Response(JSON.stringify({ error: 'Ya existe otro post con ese slug.' }), { status: 409 });
  }

  await updatePost(id, {
    slug: input.slug,
    title: input.title,
    description: input.description,
    contentMd: input.content,
    pubDate: input.pubDate,
    updatedDate: new Date(),
    author: input.author,
    categorySlug: input.category,
    draft: input.draft,
    featured: input.featured,
    tags: input.tags,
  });

  await triggerRebuild();

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return new Response(JSON.stringify({ error: 'ID inválido' }), { status: 400 });
  }

  await deletePost(id);
  await triggerRebuild();

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
