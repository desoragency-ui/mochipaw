import { useEffect, useState } from 'react';
import type { Product } from '../../lib/types';

let cache: Promise<Product[]> | null = null;

/** Loads the catalogue only when a feature needs it, so pages stay light. */
export function loadCatalog() {
  cache ??= fetch('/catalog.json').then((response) => response.json() as Promise<Product[]>);
  return cache;
}

export function useCatalog(enabled = true) {
  const [products, setProducts] = useState<Product[] | null>(null);
  useEffect(() => {
    if (enabled) loadCatalog().then(setProducts);
  }, [enabled]);
  return products;
}

/** Matches words without caring about accents or capitals. */
const fold = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

export function searchProducts(products: Product[], query: string) {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  return products.filter((item) => {
    const text = fold(`${item.name} ${item.brand ?? ''} ${item.category} ${item.shortDescription}`);
    return words.every((word) => text.includes(word));
  });
}
