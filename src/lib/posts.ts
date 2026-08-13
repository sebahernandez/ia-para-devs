import { asc, desc, eq } from 'drizzle-orm';
import { db } from './db';
import { categories, posts } from '../db/schema';

export type Category = {
  slug: string;
  label: string;
  description: string;
  accentClass: string;
};

export type PostSummary = {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  updatedDate: Date | null;
  author: string;
  category: Category;
  tags: string[];
  featured: boolean;
};

export type Post = PostSummary & { contentHtml: string };

const withRelations = {
  with: {
    category: true,
    postTags: { with: { tag: true } },
  },
} as const;

function toSummary(row: {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  updatedDate: Date | null;
  author: string;
  featured: boolean;
  category: Category;
  postTags: { tag: { name: string } }[];
}): PostSummary {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    pubDate: row.pubDate,
    updatedDate: row.updatedDate,
    author: row.author,
    featured: row.featured,
    category: {
      slug: row.category.slug,
      label: row.category.label,
      description: row.category.description,
      accentClass: row.category.accentClass,
    },
    tags: row.postTags.map((pt) => pt.tag.name),
  };
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const rows = await db.query.posts.findMany({
    where: eq(posts.draft, false),
    orderBy: [desc(posts.pubDate)],
    ...withRelations,
  });
  return rows.map(toSummary);
}

export async function getAllPostsWithContent(): Promise<Post[]> {
  const rows = await db.query.posts.findMany({
    where: eq(posts.draft, false),
    orderBy: [desc(posts.pubDate)],
    ...withRelations,
  });
  return rows.map((row) => ({ ...toSummary(row), contentHtml: row.contentHtml }));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const row = await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
    ...withRelations,
  });
  return row ? { ...toSummary(row), contentHtml: row.contentHtml } : null;
}

export async function getAllCategoryDefs(): Promise<Category[]> {
  const rows = await db.query.categories.findMany({ orderBy: [asc(categories.sortOrder)] });
  return rows.map((c) => ({
    slug: c.slug,
    label: c.label,
    description: c.description,
    accentClass: c.accentClass,
  }));
}

export async function getCategoriesWithCounts(): Promise<(Category & { count: number })[]> {
  const [allPosts, defs] = await Promise.all([getAllPosts(), getAllCategoryDefs()]);
  const counts = new Map<string, number>();
  for (const p of allPosts) counts.set(p.category.slug, (counts.get(p.category.slug) ?? 0) + 1);
  return defs
    .map((c) => ({ ...c, count: counts.get(c.slug) ?? 0 }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);
}

export function getFeaturedPost(all: PostSummary[]): PostSummary | undefined {
  return all.find((p) => p.featured) ?? all[0];
}
