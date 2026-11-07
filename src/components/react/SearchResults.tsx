import { useEffect, useState } from 'react';
import { localePath, t } from '../../i18n';
import type { Locale } from '../../lib/types';
import { ProductGrid } from './ProductGrid';
import { searchProducts, useCatalog } from './useCatalog';

export function SearchResults({ locale }: { locale: Locale }) {
  const d = t(locale);
  const products = useCatalog(locale);
  const [query, setQuery] = useState<string | null>(null);

  useEffect(() => setQuery(new URLSearchParams(window.location.search).get('q') ?? ''), []);

  if (query === null || !products) return <div className="h-64" aria-hidden="true" />;

  const results = searchProducts(products, query);

  return (
    <>
      <p aria-live="polite" className="mb-5 text-lg font-extrabold">
        {query ? d.search.resultsFor(query) : d.search.prompt}
        {query && ` : ${d.shop.results(results.length)}`}
      </p>
      {results.length > 0 ? (
        <ProductGrid products={results} locale={locale} />
      ) : (
        <div className="rounded-card bg-white p-10 text-center">
          <p className="font-display text-2xl font-semibold">{d.search.empty}</p>
          <a href={localePath(locale, '/boutique')} className="btn btn-purple mt-5">
            {d.cart.emptyCta}
          </a>
        </div>
      )}
    </>
  );
}
