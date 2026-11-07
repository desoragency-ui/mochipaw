import type { Locale } from '../lib/types';
import { ar } from './ar';
import { en } from './en';
import { fr, type Dictionary } from './fr';

/**
 * Languages the site builds. French has no prefix (/boutique); the others do (/en/boutique, /ar/boutique).
 * Add 'ary' (Darija) later: write its dictionary like ar.ts and list it here.
 */
export const activeLocales: Locale[] = ['fr', 'en', 'ar'];
export const defaultLocale: Locale = 'fr';

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية',
  ary: 'الدارجة',
};

/** Two or three letters for tight spaces (phone header). */
export const localeShort: Record<Locale, string> = { fr: 'FR', en: 'EN', ar: 'عربي', ary: 'دار' };

export const isRtl = (locale: Locale) => locale === 'ar' || locale === 'ary';
export const htmlLang = (locale: Locale) => (locale === 'ary' ? 'ar-MA' : locale);
export const ogLocale = (locale: Locale) => ({ fr: 'fr_MA', en: 'en_US', ar: 'ar_MA', ary: 'ar_MA' })[locale];

const dictionaries: Partial<Record<Locale, Dictionary>> = { fr, en, ar };

export const t = (locale: Locale): Dictionary => dictionaries[locale] ?? fr;

/** Name and description of a category in a language. */
export const categoryText = (locale: Locale, slug: string) => t(locale).categories[slug] ?? fr.categories[slug];

/** Builds a link for a language: localePath('ar', '/boutique') gives /ar/boutique. */
export function localePath(locale: Locale, path: string) {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`;
}

/** Static paths shared by every page. French has no prefix. */
export const langPaths = () =>
  activeLocales.map((locale) => ({
    params: { lang: locale === defaultLocale ? undefined : locale },
    props: { locale },
  }));
