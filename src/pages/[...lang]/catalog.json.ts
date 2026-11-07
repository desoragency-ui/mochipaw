import type { APIContext } from 'astro';
import { langPaths } from '../../i18n';
import { products, slim } from '../../lib/catalog';
import type { Locale } from '../../lib/types';

export const getStaticPaths = langPaths;

/** Read by search and favourites, only when someone uses them. One file per language: /catalog.json, /en/catalog.json, /ar/catalog.json. */
export const GET = ({ props }: APIContext) => {
  const locale = (props as { locale: Locale }).locale;
  return new Response(JSON.stringify(products.map((item) => slim(item, true, locale))), {
    headers: { 'Content-Type': 'application/json' },
  });
};
