import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Public address of the live site (canonical links, sitemap, social previews).
// Override for another address: SITE_URL=https://... npm run build
const site = process.env.SITE_URL ?? 'https://mochipaw.ma';

export default defineConfig({
  site,
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'ar', 'ary'],
    routing: { prefixDefaultLocale: false },
  },
});
