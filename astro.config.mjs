import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Replace with the real domain when it exists: SITE_URL=https://... npm run build
const site = process.env.SITE_URL ?? 'https://mochipaw.example';

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
