export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { setPostFeatured, triggerRebuild } from '../../../../../lib/admin-posts';

const bodySchema = z.object({ featured: z.boolean() });

export const POST: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return new Response(JSON.stringify({ error: 'ID inválido' }), { status: 400 });
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.message }), { status: 400 });
  }

  await setPostFeatured(id, parsed.data.featured);
  await triggerRebuild();

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
