import { and, desc, eq, ne } from 'drizzle-orm';
import { posts, postTags, tags } from '~/db/schema';
import { db } from '~/lib/db';
import { withWriteDb, type WriteTx } from '~/lib/db-write';
import { renderMarkdown } from './markdown';
import type { AdminPostRow, PostForEdit, PostInput } from './types';

async function addTags(tx: WriteTx, postId: number, names: string[]): Promise<void> {
  for (const name of names) {
    const [{ id: tagId }] = await tx
      .insert(tags)
      .values({ name })
      .onConflictDoUpdate({ target: tags.name, set: { name } })
      .returning({ id: tags.id });
    await tx.insert(postTags).values({ postId, tagId });
  }
}

// Solo puede haber un post destacado a la vez.
async function clearOtherFeatured(tx: WriteTx, postId: number): Promise<void> {
  await tx.update(posts).set({ featured: false }).where(and(eq(posts.featured, true), ne(posts.id, postId)));
}

export async function listAllPostsForAdmin(): Promise<AdminPostRow[]> {
  // Orden por fecha de publicación (más reciente primero), con id como
  // desempate estable entre requests para posts con el mismo pubDate.
  const rows = await db.query.posts.findMany({ orderBy: [desc(posts.pubDate), desc(posts.id)] });
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

      await addTags(tx, postId, input.tags);
      if (input.featured) await clearOtherFeatured(tx, postId);

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

      await addTags(tx, id, input.tags);
      if (input.featured) await clearOtherFeatured(tx, id);
    })
  );
}

export async function deletePost(id: number): Promise<void> {
  await withWriteDb(async (writeDb) => writeDb.delete(posts).where(eq(posts.id, id)));
}

// Marca (o desmarca) un post como destacado. Al marcar uno, desmarca
// cualquier otro que lo estuviera — solo puede haber uno a la vez.
export async function setPostFeatured(id: number, featured: boolean): Promise<void> {
  await withWriteDb(async (writeDb) =>
    writeDb.transaction(async (tx) => {
      if (featured) await clearOtherFeatured(tx, id);
      await tx.update(posts).set({ featured }).where(eq(posts.id, id));
    })
  );
}
