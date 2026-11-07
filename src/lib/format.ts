import type { Locale, Product } from './types';

/** Safe in the browser: no catalogue data in here. Digits stay 0-9 in every language. */
export const formatPrice = (value: number, locale: Locale = 'fr') => {
  if (locale === 'fr') return `${new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 2 }).format(value)} DH`;
  const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
  return locale === 'en' ? `${number} DH` : `${number} د.م.`;
};

/** A discount shows only when a real original price exists in the sheet. */
export function discountPercent(product: Pick<Product, 'price' | 'originalPrice'>) {
  if (!product.originalPrice || product.originalPrice <= product.price) return null;
  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
}

/** Images live in public/images. Each has -480 and -960 versions made by tools/images.mjs. */
export const imagePath = (folder: string, file: string, width: 480 | 960 = 960) =>
  `/images/${folder}/${file.replace(/\.[a-z0-9]+$/i, '')}-${width}.webp`;

export const imageSrcSet = (folder: string, file: string) =>
  `${imagePath(folder, file, 480)} 480w, ${imagePath(folder, file, 960)} 960w`;
