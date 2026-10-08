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
  const { slugExists, createPost } = await import('../src/features/posts/admin');
  const { triggerRebuild } = await import('../src/lib/rebuild');
  const { POST_AUTHOR } = await import('../src/features/posts/schema');

  const file = path.join(import.meta.dirname, '..', 'src', 'content', 'posts', `${SLUG}.md`);
  const { data, content } = matter(readFileSync(file, 'utf-8'));

  if (data.author && data.author !== POST_AUTHOR) {
    console.error(`El autor debe ser "${POST_AUTHOR}" (el frontmatter dice "${data.author}"). Aborta sin insertar.`);
    process.exit(1);
  }

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
    author: POST_AUTHOR,
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
