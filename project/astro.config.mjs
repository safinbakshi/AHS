import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://trending-news.netlify.app',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'dracula'
    }
  }
});