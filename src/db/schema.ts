import { relations } from 'drizzle-orm';
import { boolean, index, integer, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  label: text('label').notNull(),
  description: text('description').notNull(),
  accentClass: text('accent_class').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    contentMd: text('content_md').notNull(),
    contentHtml: text('content_html').notNull(),
    pubDate: timestamp('pub_date', { withTimezone: true }).notNull(),
    updatedDate: timestamp('updated_date', { withTimezone: true }),
    author: text('author').notNull().default('Sebacure'),
    categorySlug: text('category_slug')
      .notNull()
      .references(() => categories.slug),
    draft: boolean('draft').notNull().default(false),
    featured: boolean('featured').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('posts_pub_date_idx').on(t.pubDate),
    index('posts_category_idx').on(t.categorySlug),
    index('posts_draft_idx').on(t.draft),
  ]
);

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
});

export const postTags = pgTable(
  'post_tags',
  {
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.postId, t.tagId] }), index('post_tags_tag_id_idx').on(t.tagId)]
);

export const postsRelations = relations(posts, ({ one, many }) => ({
  category: one(categories, { fields: [posts.categorySlug], references: [categories.slug] }),
  postTags: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, { fields: [postTags.postId], references: [posts.id] }),
  tag: one(tags, { fields: [postTags.tagId], references: [tags.id] }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}));
