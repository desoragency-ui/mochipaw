import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { t } from '../../i18n';
import { formatPrice } from '../../lib/format';
import type { Locale, PetType, Product } from '../../lib/types';
import { Drawer } from './Drawer';
import { ProductCard } from './ProductCard';

type Sort = 'new' | 'asc' | 'desc';

interface Props {
  products: Product[];
  categories: { slug: string; name: string }[];
  locale: Locale;
  /** Hides the category filter on pages that already show one category. */
  hideCategories?: boolean;
  emptyText?: string;
}

const PAGE = 24;
const PETS: PetType[] = ['chat', 'chien', 'autre', 'tous'];

/** Page numbers to show: first, last, the current page and its neighbours; null = a gap ("…"). */
function pageList(current: number, total: number): (number | null)[] {
  const wanted = [...new Set([1, current - 1, current, current + 1, total])]
    .filter((number) => number >= 1 && number <= total)
    .sort((a, b) => a - b);
  const list: (number | null)[] = [];
  wanted.forEach((number, index) => {
    const before = wanted[index - 1];
    if (before !== undefined && number - before === 2) list.push(before + 1);
    else if (before !== undefined && number - before > 2) list.push(null);
    list.push(number);
  });
  return list;
}

export function ShopBrowser({ products, categories, locale, hideCategories, emptyText }: Props) {
  const d = t(locale);
  const highest = useMemo(() => Math.max(0, ...products.map((item) => item.price)), [products]);
  const brands = useMemo(
    () => ([...new Set(products.map((item) => item.brand).filter(Boolean))] as string[]).sort((a, b) => a.localeCompare(b)),
    [products],
  );

  const [selected, setSelected] = useState<string[]>([]);
  const [pets, setPets] = useState<PetType[]>([]);
  const [chosenBrands, setChosenBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(highest);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState<Sort>('new');
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  // A click on a logo of the home page brand band arrives as /boutique?marque=Royal%20Canin.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get('marque');
    if (wanted && brands.includes(wanted)) setChosenBrands([wanted]);
  }, [brands]);

  const flip = <T,>(list: T[], value: T) =>
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

  const results = useMemo(() => {
    const list = products.filter(
      (item) =>
        (selected.length === 0 || selected.includes(item.category)) &&
        (pets.length === 0 || pets.includes(item.pet) || item.pet === 'tous') &&
        (chosenBrands.length === 0 || (item.brand && chosenBrands.includes(item.brand))) &&
        item.price <= maxPrice &&
        (!inStock || item.stock === 'in_stock'),
    );
    return [...list].sort((a, b) => {
      if (sort === 'asc') return a.price - b.price;
      if (sort === 'desc') return b.price - a.price;
      return (b.addedOn ?? '').localeCompare(a.addedOn ?? '');
    });
  }, [products, selected, pets, chosenBrands, maxPrice, inStock, sort]);

  // Any change of filter or sort starts again at page 1.
  useEffect(() => setPage(1), [selected, pets, chosenBrands, maxPrice, inStock, sort]);

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE));
  const current = Math.min(page, pageCount);
  const goTo = (number: number) => {
    setPage(number);
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const reset = () => {
    setSelected([]);
    setPets([]);
    setChosenBrands([]);
    setMaxPrice(highest);
    setInStock(false);
    setPage(1);
  };

  const check = (label: string, checked: boolean, onChange: () => void) => (
    <label key={label} className="flex min-h-10 cursor-pointer items-center gap-2.5 font-semibold">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-5 w-5 accent-purple" />
      {label}
    </label>
  );

  const filters = (
    <div className="flex flex-col gap-6">
      {!hideCategories && (
        <fieldset>
          <legend className="mb-1 font-display text-lg font-semibold">{d.shop.category}</legend>
          {categories.map((item) =>
            check(item.name, selected.includes(item.slug), () => setSelected(flip(selected, item.slug))),
          )}
        </fieldset>
      )}
      <fieldset>
        <legend className="mb-1 font-display text-lg font-semibold">{d.shop.pet}</legend>
        {PETS.filter((pet) => pet !== 'tous').map((pet) =>
          check(d.shop.pets[pet], pets.includes(pet), () => setPets(flip(pets, pet))),
        )}
      </fieldset>
      {brands.length > 0 && (
        <fieldset>
          <legend className="mb-1 font-display text-lg font-semibold">{d.shop.brand}</legend>
          {brands.map((brand) =>
            check(brand, chosenBrands.includes(brand), () => setChosenBrands(flip(chosenBrands, brand))),
          )}
        </fieldset>
      )}
      <div>
        <label htmlFor="price-max" className="mb-1 block font-display text-lg font-semibold">
          {d.shop.price} : {formatPrice(maxPrice, locale)}
        </label>
        <input
          id="price-max"
          type="range"
          min={0}
          max={highest}
          step={1}
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          className="w-full accent-purple"
        />
      </div>
      <fieldset>
        <legend className="mb-1 font-display text-lg font-semibold">{d.shop.availability}</legend>
        {check(d.shop.inStockOnly, inStock, () => setInStock(!inStock))}
      </fieldset>
      <button type="button" onClick={reset} className="self-start font-extrabold text-purple underline underline-offset-4">
        {d.shop.reset}
      </button>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside aria-label={d.shop.filters} className="hidden self-start rounded-card bg-white p-6 lg:block">
        {filters}
      </aside>

      <div className="min-w-0">
        <div ref={top} className="mb-5 flex scroll-mt-28 flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="font-extrabold">
            {d.shop.results(results.length)}
          </p>
          <div className="flex max-w-full min-w-0 flex-wrap items-center gap-2">
            <button type="button" onClick={() => setDrawer(true)} className="btn btn-ghost !min-h-11 !py-2 lg:hidden">
              <SlidersHorizontal size={17} aria-hidden="true" /> {d.shop.openFilters}
            </button>
            <label className="sr-only" htmlFor="sort">
              {d.shop.sort}
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as Sort)}
              className="field !min-h-11 !w-auto !max-w-full !py-2"
            >
              <option value="new">{d.shop.sortNew}</option>
              <option value="asc">{d.shop.sortAsc}</option>
              <option value="desc">{d.shop.sortDesc}</option>
            </select>
          </div>
        </div>

        {chosenBrands.length > 0 && (
          <ul className="mb-5 flex flex-wrap gap-2" aria-label={d.shop.brand}>
            {chosenBrands.map((brand) => (
              <li key={brand}>
                <button
                  type="button"
                  aria-label={`${d.shop.reset} : ${brand}`}
                  onClick={() => setChosenBrands(chosenBrands.filter((item) => item !== brand))}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full bg-purple px-4 font-extrabold text-white transition hover:bg-purple-deep"
                >
                  {brand} <X size={16} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {results.length === 0 ? (
          <div className="rounded-card bg-white p-10 text-center">
            <p className="font-display text-2xl font-semibold">{emptyText ?? d.shop.empty}</p>
            {products.length > 0 && (
              <button type="button" onClick={reset} className="btn btn-purple mt-5">
                {d.shop.reset}
              </button>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
            {results.slice((current - 1) * PAGE, current * PAGE).map((product, index) => (
              <li key={product.id}>
                <ProductCard product={product} locale={locale} eager={index < 4} />
              </li>
            ))}
          </ul>
        )}

        {pageCount > 1 && (
          <nav aria-label={d.shop.pagination} className="mt-10 flex flex-col items-center gap-4">
            <ul className="flex flex-wrap items-center justify-center gap-1">
              {pageList(current, pageCount).map((number, index) =>
                number === null ? (
                  <li key={`gap-${index}`} aria-hidden="true" className="grid h-10 w-6 place-items-center font-extrabold text-brown/60">
                    …
                  </li>
                ) : (
                  <li key={number}>
                    <button
                      type="button"
                      aria-label={d.shop.page(number)}
                      aria-current={number === current ? 'page' : undefined}
                      onClick={() => goTo(number)}
                      className={`grid h-10 min-w-10 place-items-center rounded-full px-1 font-extrabold transition ${
                        number === current ? 'bg-purple text-white' : 'bg-white text-brown hover:bg-purple hover:text-white'
                      }`}
                    >
                      {number}
                    </button>
                  </li>
                ),
              )}
            </ul>
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label={d.shop.prevPage}
                disabled={current === 1}
                onClick={() => goTo(current - 1)}
                className="grid h-11 w-11 place-items-center rounded-full bg-white text-purple transition hover:bg-purple hover:text-white disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-purple"
              >
                <ChevronLeft size={20} aria-hidden="true" className="rtl:rotate-180" />
              </button>
              <p className="min-w-28 text-center text-sm font-bold text-brown/70">{d.shop.pageOf(current, pageCount)}</p>
              <button
                type="button"
                aria-label={d.shop.nextPage}
                disabled={current === pageCount}
                onClick={() => goTo(current + 1)}
                className="grid h-11 w-11 place-items-center rounded-full bg-white text-purple transition hover:bg-purple hover:text-white disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-purple"
              >
                <ChevronRight size={20} aria-hidden="true" className="rtl:rotate-180" />
              </button>
            </div>
          </nav>
        )}
      </div>

      <Drawer open={drawer} onClose={() => setDrawer(false)} label={d.shop.filters} closeLabel={d.shop.closeFilters} side="start">
        <div className="flex-1 overflow-y-auto px-6 pb-4 pt-6">
          <h2 className="display mb-5 text-3xl text-purple">{d.shop.filters}</h2>
          {filters}
        </div>
        <div className="bg-white p-4">
          <button type="button" onClick={() => setDrawer(false)} className="btn btn-purple w-full">
            {d.shop.apply} ({results.length})
          </button>
        </div>
      </Drawer>
    </div>
  );
}
