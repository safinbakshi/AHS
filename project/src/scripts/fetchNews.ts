import { format } from 'date-fns';
import path from 'path';
import fs from 'fs/promises';
import { newsApi } from '../utils/api';
import { downloadImage } from '../utils/image';
import { createSlug } from '../utils/slug';

async function fetchNews() {
  try {
    const response = await newsApi.v2.topHeadlines({
      language: 'en',
      country: 'us',
      pageSize: 100
    });

    for (const article of response.articles) {
      if (!article.title || !article.description) continue;

      const date = format(new Date(article.publishedAt), 'yyyy-MM-dd');
      const slug = createSlug(article.title);
      let imagePath = '';

      // Download and save image if available
      if (article.urlToImage) {
        const imageExt = article.urlToImage.split('.').pop();
        imagePath = `/images/news/${date}-${slug}.${imageExt}`;
        await downloadImage(article.urlToImage, `public${imagePath}`);
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
  }
}

fetchNews();