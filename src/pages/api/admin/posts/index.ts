export const prerender = false;

import type { APIRoute } from 'astro';
import { createPost, slugExists } from '~/features/posts/admin';
import { postInputSchema, toPostInput } from '~/features/posts/schema';
import { json } from '~/lib/http';
import { triggerRebuild } from '~/lib/rebuild';

export const POST: APIRoute = async ({ request }) => {
  const parsed = postInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return json({ error: parsed.error.message }, 400);
  const input = toPostInput(parsed.data, null);

  if (await slugExists(input.slug)) return json({ error: 'Ya existe un post con ese slug.' }, 409);

  await createPost(input);

  if (!input.draft) await triggerRebuild();

  return json({ ok: true }, 201);
};
