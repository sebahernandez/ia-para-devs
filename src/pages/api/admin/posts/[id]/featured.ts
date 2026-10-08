export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { setPostFeatured } from '~/features/posts/admin';
import { json, parseId } from '~/lib/http';
import { triggerRebuild } from '~/lib/rebuild';

const bodySchema = z.object({ featured: z.boolean() });

export const POST: APIRoute = async ({ params, request }) => {
  const id = parseId(params.id);
  if (id === null) return json({ error: 'ID inválido' }, 400);

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return json({ error: parsed.error.message }, 400);

  await setPostFeatured(id, parsed.data.featured);
  await triggerRebuild();

  return json({ ok: true });
};
