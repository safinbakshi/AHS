import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const news = await getCollection('news');
  return rss({
    title: 'TrendingNews',
    description: 'Your source for the latest trending news',
    site: context.site,
    items: news.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/news/${post.slug}/`,
    })),
  });
}