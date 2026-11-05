import { products } from '../lib/catalog';

/** Read by search and favourites, only when someone uses them. */
export const GET = () =>
  new Response(JSON.stringify(products), { headers: { 'Content-Type': 'application/json' } });
