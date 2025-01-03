import NewsAPI from 'newsapi';
import { format } from 'date-fns';
import fs from 'fs/promises';
import path from 'path';

const newsapi = new NewsAPI('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');

async function downloadImage(url, filename) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  await fs.writeFile(filename, Buffer.from(buffer));
}

async function createDirectoryIfNotExists(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function fetchNews() {
  try {
    // Ensure directories exist
    await createDirectoryIfNotExists('public/images/news');
    await createDirectoryIfNotExists('src/content/news');

    const response = await newsapi.v2.topHeadlines({
      language: 'en',
      country: 'us',
      pageSize: 100
    });

    for (const article of response.articles) {
      if (!article.title || !article.description) continue;

      const date = format(new Date(article.publishedAt), 'yyyy-MM-dd');
      const slug = article.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');

      let imagePath = '';

      // Download and save image if available
      if (article.urlToImage) {
        try {
          const imageExt = article.urlToImage.split('.').pop().split('?')[0];
          imagePath = `/images/news/${date}-${slug}.${imageExt}`;
          await downloadImage(article.urlToImage, `public${imagePath}`);
        } catch (error) {
          console.error(`Failed to download image for article: ${article.title}`);
          imagePath = ''; // Reset image path if download failed
        }
      }

      // Create markdown file
      const markdown = `---
title: ${article.title.replace(/"/g, '\\"')}
description: ${article.description.replace(/"/g, '\\"')}
publishDate: ${article.publishedAt}
${imagePath ? `image: ${imagePath}` : ''}
source: ${article.source.name}
sourceUrl: ${article.url}
---

${article.content || article.description}
`;

      await fs.writeFile(
        path.join('src/content/news', `${date}-${slug}.md`),
        markdown
      );
    }

    console.log('News articles fetched and saved successfully!');
  } catch (error) {
    console.error('Error fetching news:', error);
    process.exit(1);
  }
}

fetchNews();