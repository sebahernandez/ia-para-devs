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
