import { Search } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { localePath, t } from '../../i18n';
import { formatPrice } from '../../lib/format';
import { $searchOpen } from '../../lib/stores';
import type { Locale } from '../../lib/types';
import { Drawer } from './Drawer';
import { useClientStore } from './hooks';
import { ProductImage } from './ProductImage';
import { searchProducts, useCatalog } from './useCatalog';

export function SearchOverlay({ locale }: { locale: Locale }) {
  const d = t(locale);
  const open = useClientStore($searchOpen, false);
  const products = useCatalog(open);
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) window.setTimeout(() => input.current?.focus(), 80);
  }, [open]);

  const results = products ? searchProducts(products, query).slice(0, 6) : [];

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      window.location.href = `${localePath(locale, '/recherche')}?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <Drawer open={open} onClose={() => $searchOpen.set(false)} label={d.search.label} closeLabel={d.search.close} side="top">
      <div className="shell overflow-y-auto py-6">
        <form role="search" onSubmit={submit} className="me-14 flex items-center gap-3">
          <label htmlFor="site-search" className="sr-only">
            {d.search.label}
          </label>
          <Search size={24} aria-hidden="true" className="shrink-0 text-purple" />
          <input
            ref={input}
            id="site-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={d.search.placeholder}
            className="field !border-0 !bg-transparent !px-0 font-display !text-2xl sm:!text-3xl"
          />
        </form>
        <div className="mt-4">
          {query.trim() === '' ? (
            <p className="font-semibold text-brown/70">{d.search.prompt}</p>
          ) : results.length === 0 ? (
            <p aria-live="polite" className="font-semibold text-brown/70">
              {products ? d.search.empty : ''}
            </p>
          ) : (
            <>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((item) => (
                  <li key={item.id}>
                    <a href={localePath(locale, `/produit/${item.slug}`)} className="flex items-center gap-3 rounded-2xl bg-white p-2.5 transition hover:shadow-soft">
                      <span className="h-14 w-14 shrink-0 rounded-xl bg-cream p-1">
                        <ProductImage file={item.images[0]} alt="" sizes="56px" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-extrabold leading-snug">{item.name}</span>
                        <span className="text-sm font-bold text-brown/70">{formatPrice(item.price)}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={submit} className="mt-4 font-extrabold text-purple underline underline-offset-4">
                {d.search.seeAll}
              </button>
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
}
