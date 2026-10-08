export const prerender = false;

import type { APIRoute } from 'astro';
import { deletePost, slugExists, updatePost } from '~/features/posts/admin';
import { postInputSchema, toPostInput } from '~/features/posts/schema';
import { json, parseId } from '~/lib/http';
import { triggerRebuild } from '~/lib/rebuild';

export const PUT: APIRoute = async ({ params, request }) => {
  const id = parseId(params.id);
  if (id === null) return json({ error: 'ID inválido' }, 400);

  const parsed = postInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return json({ error: parsed.error.message }, 400);
  const input = toPostInput(parsed.data, new Date());

  if (await slugExists(input.slug, id)) return json({ error: 'Ya existe otro post con ese slug.' }, 409);

  await updatePost(id, input);
  await triggerRebuild();

  return json({ ok: true });
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = parseId(params.id);
  if (id === null) return json({ error: 'ID inválido' }, 400);

  await deletePost(id);
  await triggerRebuild();

  return json({ ok: true });
};
