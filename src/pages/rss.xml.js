import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Blog IA para devs',
    description:
      'Noticias, análisis y tutoriales sobre modelos de inteligencia artificial para desarrolladores.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: [post.data.category, ...post.data.tags],
      author: post.data.author,
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>es</language>`,
  });
}