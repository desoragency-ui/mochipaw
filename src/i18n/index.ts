import type { Locale } from '../lib/types';
import { fr, type Dictionary } from './fr';

/**
 * Languages the site builds. Add 'ar' or 'ary' here once their text is approved:
 * pages, the language switch and right-to-left layout turn on by themselves.
 */
export const activeLocales: Locale[] = ['fr'];
export const defaultLocale: Locale = 'fr';

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  ar: 'العربية',
  ary: 'الدارجة',
};

export const isRtl = (locale: Locale) => locale !== 'fr';

const dictionaries: Partial<Record<Locale, Dictionary>> = { fr };

export const t = (locale: Locale): Dictionary => dictionaries[locale] ?? fr;

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
