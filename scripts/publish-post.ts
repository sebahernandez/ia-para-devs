// Publica un post desde src/content/posts/<slug>.md a la DB y dispara el rebuild.
// Reutiliza createPost() (render md->html, tags, transacción) y slugExists() para
// no duplicar. Idempotente: si el slug ya existe, aborta sin insertar.
// Uso: npx tsx scripts/publish-post.ts <slug>
process.loadEnvFile('.env');

import { readFileSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const SLUG = process.argv[2];
if (!SLUG) {
  console.error('Uso: npx tsx scripts/publish-post.ts <slug>');
  process.exit(1);
}

async function main() {
  const { slugExists, createPost, triggerRebuild } = await import('../src/lib/admin-posts');

  const file = path.join(import.meta.dirname, '..', 'src', 'content', 'posts', `${SLUG}.md`);
  const { data, content } = matter(readFileSync(file, 'utf-8'));

  if (await slugExists(SLUG)) {
    console.error(`El slug "${SLUG}" ya existe. Aborta sin insertar.`);
    process.exit(1);
  }

  const id = await createPost({
    slug: SLUG,
    title: data.title,
    description: data.description,
    contentMd: content.trim(),
    pubDate: new Date(data.pubDate),
    updatedDate: data.updatedDate ? new Date(data.updatedDate) : null,
    author: data.author ?? 'Sebacure',
    categorySlug: data.category,
    draft: data.draft ?? false,
    featured: data.featured ?? false,
    tags: data.tags ?? [],
  });

  console.log(`Post creado con id ${id}. Disparando rebuild...`);
  await triggerRebuild();
  console.log('Listo. Rebuild disparado (si NETLIFY_BUILD_HOOK_URL está configurado).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
