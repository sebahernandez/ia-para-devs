// Updates an existing post from src/content/posts/<slug>.md and triggers the rebuild.
// Keeps slug, pubDate, featured and draft from the database; sets updatedDate to now.
// Never creates posts: aborts if the slug does not exist (spec post-publishing).
// Usage: npx tsx scripts/update-post.ts <slug>
process.loadEnvFile('.env');

import { readFileSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const SLUG = process.argv[2];
if (!SLUG) {
  console.error('Uso: npx tsx scripts/update-post.ts <slug>');
  process.exit(1);
}

async function main() {
  const { listAllPostsForAdmin, getPostForEdit, updatePost } = await import('../src/features/posts/admin');
  const { postInputSchema, toPostInput } = await import('../src/features/posts/schema');
  const { triggerRebuild } = await import('../src/lib/rebuild');

  const row = (await listAllPostsForAdmin()).find((p) => p.slug === SLUG);
  const current = row && (await getPostForEdit(row.id));
  if (!current) {
    console.error(`El slug "${SLUG}" no existe. Aborta sin escribir.`);
    process.exit(1);
  }

  const file = path.join(import.meta.dirname, '..', 'src', 'content', 'posts', `${SLUG}.md`);
  const { data, content } = matter(readFileSync(file, 'utf-8'));

  const parsed = postInputSchema.safeParse({
    title: data.title,
    slug: SLUG,
    description: data.description,
    category: data.category,
    pubDate: current.pubDate,
    tags: data.tags ?? [],
    author: data.author,
    draft: current.draft,
    featured: current.featured,
    content: content.trim(),
  });
  if (!parsed.success) {
    console.error('Archivo fuente inválido. Aborta sin escribir.\n', parsed.error.issues);
    process.exit(1);
  }

  // An unknown category fails the foreign key inside the transaction: nothing changes.
  await updatePost(current.id, toPostInput(parsed.data, new Date()));

  console.log(`Post ${current.id} actualizado. Disparando rebuild...`);
  await triggerRebuild();
  console.log('Listo. Rebuild disparado (si NETLIFY_BUILD_HOOK_URL está configurado).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
