import type { APIRoute } from 'astro';
import { site as shop } from '../data/site';

export const GET: APIRoute = ({ site }) => {
  const rules = shop.demoMode ? 'User-agent: *\nDisallow: /' : 'User-agent: *\nAllow: /';
  return new Response(`${rules}\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`);
};
