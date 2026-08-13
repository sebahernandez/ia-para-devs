import rss from '@astrojs/rss';
import { getAllPosts } from '../lib/posts';

export async function GET(context) {
  const posts = await getAllPosts();

  return rss({
    title: 'Blog IA para devs',
    description:
      'Noticias, análisis y tutoriales sobre modelos de inteligencia artificial para desarrolladores.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.title,
      description: post.description,
      pubDate: post.pubDate,
      categories: [post.category.slug, ...post.tags],
      author: post.author,
      link: `/blog/${post.slug}/`,
    })),
    customData: `<language>es</language>`,
  });
}