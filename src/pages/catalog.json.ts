import { products, slim } from '../lib/catalog';

/** Read by search and favourites, only when someone uses them. */
export const GET = () =>
  new Response(JSON.stringify(products.map((item) => slim(item, true))), { headers: { 'Content-Type': 'application/json' } });
