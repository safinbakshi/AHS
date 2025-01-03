import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('news');
  const trendingPosts = posts
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())
    .slice(0, 5)
    .map(post => ({
      title: post.data.title,
      slug: post.slug,
      source: post.data.source
    }));

  return new Response(JSON.stringify(trendingPosts), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}