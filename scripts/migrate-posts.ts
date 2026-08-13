import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { z } from 'zod';
import { posts, tags, postTags } from '../src/db/schema';
import { renderMarkdown } from '../src/lib/markdown';

// Espejo exacto del schema en src/content.config.ts, para no migrar silenciosamente
// datos que Astro nunca hubiera aceptado.
const frontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  author: z.string().default('Sebacure'),
  tags: z.array(z.string()).default([]),
  category: z.enum(['modelos', 'herramientas', 'investigacion', 'opinión', 'tutorial']),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
});

const POSTS_DIR = path.join(import.meta.dirname, '..', 'src', 'content', 'posts');

async function main() {
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));

  const parsed: { slug: string; data: z.infer<typeof frontmatterSchema>; contentMd: string }[] = [];
  const failures: string[] = [];

  for (const file of files) {
    const raw = readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { data, content } = matter(raw);
    const result = frontmatterSchema.safeParse(data);
    if (!result.success) {
      failures.push(`${file}: ${result.error.message}`);
      continue;
    }
    parsed.push({
      slug: path.basename(file, '.md'),
      data: result.data,
      contentMd: content.trim(),
    });
  }

  if (failures.length > 0) {
    console.error(`${failures.length} archivo(s) fallaron la validación:`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  const db = drizzle(pool);

  let inserted = 0;

  await db.transaction(async (tx) => {
    for (const post of parsed) {
      const contentHtml = await renderMarkdown(post.contentMd);

      const [{ id: postId }] = await tx
        .insert(posts)
        .values({
          slug: post.slug,
          title: post.data.title,
          description: post.data.description,
          contentMd: post.contentMd,
          contentHtml,
          pubDate: post.data.pubDate,
          updatedDate: post.data.updatedDate ?? null,
          author: post.data.author,
          categorySlug: post.data.category,
          draft: post.data.draft,
          featured: post.data.featured,
        })
        .returning({ id: posts.id });

      for (const tagName of post.data.tags) {
        const [{ id: tagId }] = await tx
          .insert(tags)
          .values({ name: tagName })
          .onConflictDoUpdate({ target: tags.name, set: { name: tagName } })
          .returning({ id: tags.id });

        await tx.insert(postTags).values({ postId, tagId });
      }

      inserted++;
    }
  });

  console.log(`Migrados ${inserted} de ${files.length} archivos.`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
