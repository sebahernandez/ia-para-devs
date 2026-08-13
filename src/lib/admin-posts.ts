import { desc, eq } from 'drizzle-orm';
import { db } from './db';
import { withWriteDb } from './db-write';
import { renderMarkdown } from './markdown';
import { posts, postTags, tags } from '../db/schema';

export type PostInput = {
  slug: string;
  title: string;
  description: string;
  contentMd: string;
  pubDate: Date;
  updatedDate: Date | null;
  author: string;
  categorySlug: string;
  draft: boolean;
  featured: boolean;
  tags: string[];
};

export type AdminPostRow = {
  id: number;
  slug: string;
  title: string;
  categorySlug: string;
  draft: boolean;
  featured: boolean;
  pubDate: Date;
};

export type PostForEdit = PostInput & { id: number };

export async function listAllPostsForAdmin(): Promise<AdminPostRow[]> {
  const rows = await db.query.posts.findMany({ orderBy: [desc(posts.createdAt)] });
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    categorySlug: r.categorySlug,
    draft: r.draft,
    featured: r.featured,
    pubDate: r.pubDate,
  }));
}

export async function getPostForEdit(id: number): Promise<PostForEdit | null> {
  const row = await db.query.posts.findFirst({
    where: eq(posts.id, id),
    with: { postTags: { with: { tag: true } } },
  });
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    contentMd: row.contentMd,
    pubDate: row.pubDate,
    updatedDate: row.updatedDate,
    author: row.author,
    categorySlug: row.categorySlug,
    draft: row.draft,
    featured: row.featured,
    tags: row.postTags.map((pt) => pt.tag.name),
  };
}

export async function slugExists(slug: string, excludingId?: number): Promise<boolean> {
  const row = await db.query.posts.findFirst({ where: eq(posts.slug, slug) });
  if (!row) return false;
  return row.id !== excludingId;
}

export async function createPost(input: PostInput): Promise<number> {
  const contentHtml = await renderMarkdown(input.contentMd);

  return withWriteDb(async (writeDb) =>
    writeDb.transaction(async (tx) => {
      const [{ id: postId }] = await tx
        .insert(posts)
        .values({ ...input, contentHtml })
        .returning({ id: posts.id });

      for (const name of input.tags) {
        const [{ id: tagId }] = await tx
          .insert(tags)
          .values({ name })
          .onConflictDoUpdate({ target: tags.name, set: { name } })
          .returning({ id: tags.id });
        await tx.insert(postTags).values({ postId, tagId });
      }

      return postId;
    })
  );
}

export async function updatePost(id: number, input: PostInput): Promise<void> {
  const contentHtml = await renderMarkdown(input.contentMd);

  await withWriteDb(async (writeDb) =>
    writeDb.transaction(async (tx) => {
      await tx
        .update(posts)
        .set({ ...input, contentHtml, updatedAt: new Date() })
        .where(eq(posts.id, id));

      await tx.delete(postTags).where(eq(postTags.postId, id));

      for (const name of input.tags) {
        const [{ id: tagId }] = await tx
          .insert(tags)
          .values({ name })
          .onConflictDoUpdate({ target: tags.name, set: { name } })
          .returning({ id: tags.id });
        await tx.insert(postTags).values({ postId: id, tagId });
      }
    })
  );
}

export async function deletePost(id: number): Promise<void> {
  await withWriteDb(async (writeDb) => writeDb.delete(posts).where(eq(posts.id, id)));
}

export async function triggerRebuild(): Promise<void> {
  const url = process.env.NETLIFY_BUILD_HOOK_URL;
  if (!url) return;
  try {
    await fetch(url, { method: 'POST' });
  } catch {
    // El contenido ya quedó guardado en Neon; un fallo del webhook no debe
    // hacer fallar el guardado, solo retrasar la publicación del rebuild.
  }
}
