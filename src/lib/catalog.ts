import { existsSync } from 'node:fs';
import raw from '../data/products.csv?raw';
import type { PetType, Product, ProductVariant, StockStatus } from './types';

/**
 * The whole catalogue comes from src/data/products.csv.
 * To change products: replace that file. No page or component holds product data.
 *
 * Lists inside one cell use | as separator:
 *   images      a.webp|b.webp
 *   variants    2 kg:199|5 kg:399:449   (label:price:original price)
 *   attributes  Âge:Adulte|Format:Sac
 */

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(cell);
      cell = '';
    } else if (char === '\n') {
      row.push(cell.replace(/\r$/, ''));
      if (row.some((value) => value.trim() !== '')) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }
  row.push(cell.replace(/\r$/, ''));
  if (row.some((value) => value.trim() !== '')) rows.push(row);
  return rows;
}

const toNumber = (value: string) => {
  const parsed = Number(value.replace(',', '.'));
  return value.trim() !== '' && Number.isFinite(parsed) ? parsed : undefined;
};

const toBool = (value: string) => ['1', 'oui', 'yes', 'true'].includes(value.trim().toLowerCase());

const toList = (value: string) =>
  value
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);

function toVariants(value: string): ProductVariant[] {
  return toList(value).flatMap((item) => {
    const [label, price, originalPrice] = item.split(':').map((part) => part.trim());
    const parsedPrice = toNumber(price ?? '');
    if (!label || parsedPrice === undefined) return [];
    return [{ label, price: parsedPrice, originalPrice: toNumber(originalPrice ?? '') }];
  });
}

function toAttributes(value: string) {
  return Object.fromEntries(
    toList(value).flatMap((item) => {
      const index = item.indexOf(':');
      return index > 0 ? [[item.slice(0, index).trim(), item.slice(index + 1).trim()]] : [];
    }),
  ) as Record<string, string>;
}

/** A product only lists images that are really in the folder, so the site never shows a broken picture. */
const imageExists = (file: string) =>
  existsSync(`public/images/products/${file.replace(/\.[a-z0-9]+$/i, '')}-480.webp`);

function load(): Product[] {
  const [header, ...rows] = parseCsv(raw.replace(/^﻿/, ''));
  if (!header) return [];
  const columns = header.map((name) => name.trim());

  return rows.map((cells) => {
    const get = (name: string) => (cells[columns.indexOf(name)] ?? '').trim();
    return {
      id: get('id'),
      slug: get('slug'),
      name: get('name'),
      brand: get('brand') || undefined,
      category: get('category'),
      pet: (get('pet') || 'tous') as PetType,
      shortDescription: get('short_description'),
      description: get('description'),
      price: toNumber(get('price_mad')) ?? 0,
      originalPrice: toNumber(get('original_price_mad')),
      images: toList(get('images')).filter(imageExists),
      variants: toVariants(get('variants')),
      sku: get('sku'),
      stock: (get('stock') === 'out_of_stock' ? 'out_of_stock' : 'in_stock') as StockStatus,
      weight: get('weight') || undefined,
      attributes: toAttributes(get('attributes')),
      ingredients: get('ingredients') || undefined,
      nutrition: get('nutrition') || undefined,
      usage: get('usage') || undefined,
      featured: toBool(get('featured')),
      isNew: toBool(get('new')),
      addedOn: get('added_on') || undefined,
      sample: toBool(get('sample')),
    };
  });
}

export const products = load();

export const productBySlug = (slug: string) => products.find((item) => item.slug === slug);

export const productsInCategory = (slug: string) =>
  products.filter((item) => item.category === slug);

export const productsForPet = (pet: PetType) =>
  products.filter((item) => item.pet === pet || item.pet === 'tous');

export const featuredProducts = () => products.filter((item) => item.featured);

export const newProducts = () => products.filter((item) => item.isNew);

/** A discount shows only when a real original price exists in the sheet. */
export const onOffer = () =>
  products.filter((item) => item.originalPrice !== undefined && item.originalPrice > item.price);

export function relatedProducts(product: Product, limit = 4) {
  const sameCategory = products.filter(
    (item) => item.id !== product.id && item.category === product.category,
  );
  const samePet = products.filter(
    (item) =>
      item.id !== product.id && item.category !== product.category && item.pet === product.pet,
  );
  return [...sameCategory, ...samePet].slice(0, limit);
}
