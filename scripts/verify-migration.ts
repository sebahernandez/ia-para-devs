import { readdirSync } from 'node:fs';
import path from 'node:path';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { categories, posts, tags } from '../src/db/schema';

const POSTS_DIR = path.join(import.meta.dirname, '..', 'src', 'content', 'posts');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  const db = drizzle(pool);

  const fileSlugs = readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.basename(f, '.md'))
    .sort();

  const dbPosts = await db.select({ slug: posts.slug }).from(posts);
  const dbSlugs = dbPosts.map((p) => p.slug).sort();

  console.log(`Archivos .md: ${fileSlugs.length}`);
  console.log(`Filas en posts: ${dbSlugs.length}`);

  const missing = fileSlugs.filter((s) => !dbSlugs.includes(s));
  const extra = dbSlugs.filter((s) => !fileSlugs.includes(s));
  console.log(`Slugs faltantes en DB: ${missing.length}`, missing);
  console.log(`Slugs de más en DB: ${extra.length}`, extra);

  const catRows = await db.select().from(categories);
  console.log(`\nCategorías (${catRows.length}):`);
  for (const c of catRows) console.log(`  ${c.slug} — ${c.label}`);

  const tagRows = await db.select().from(tags);
  console.log(`\nTotal de tags únicos: ${tagRows.length}`);

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
