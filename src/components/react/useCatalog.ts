import { useEffect, useState } from 'react';
import { localePath } from '../../i18n';
import type { Locale, Product } from '../../lib/types';

const cache: Partial<Record<Locale, Promise<Product[]>>> = {};

/** Loads the catalogue (names in the page language) only when a feature needs it, so pages stay light. */
export function loadCatalog(locale: Locale) {
  cache[locale] ??= fetch(localePath(locale, '/catalog.json')).then((response) => response.json() as Promise<Product[]>);
  return cache[locale]!;
}

export function useCatalog(locale: Locale, enabled = true) {
  const [products, setProducts] = useState<Product[] | null>(null);
  useEffect(() => {
    if (enabled) loadCatalog(locale).then(setProducts);
  }, [enabled, locale]);
  return products;
}

/** Matches words without caring about accents or capitals. */
const fold = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/** Finds products by name (page language or French), brand, category, short text or MP ID. */
export function searchProducts(products: Product[], query: string) {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  return products.filter((item) => {
    const text = fold(`${item.id} ${item.name} ${item.nameFr ?? ''} ${item.brand ?? ''} ${item.category} ${item.shortDescription}`);
    return words.every((word) => text.includes(word));
  });
}
