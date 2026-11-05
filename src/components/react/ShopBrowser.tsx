import { SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
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

const PAGE = 12;
const PETS: PetType[] = ['chat', 'chien', 'tous'];

export function ShopBrowser({ products, categories, locale, hideCategories, emptyText }: Props) {
  const d = t(locale);
  const highest = useMemo(() => Math.max(0, ...products.map((item) => item.price)), [products]);
  const brands = useMemo(
    () => [...new Set(products.map((item) => item.brand).filter(Boolean))] as string[],
    [products],
  );

  const [selected, setSelected] = useState<string[]>([]);
  const [pets, setPets] = useState<PetType[]>([]);
  const [chosenBrands, setChosenBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(highest);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState<Sort>('new');
  const [visible, setVisible] = useState(PAGE);
  const [drawer, setDrawer] = useState(false);

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

  const reset = () => {
    setSelected([]);
    setPets([]);
    setChosenBrands([]);
    setMaxPrice(highest);
    setInStock(false);
    setVisible(PAGE);
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
            check(item.name, selected.includes(item.slug), () => {
              setSelected(flip(selected, item.slug));
              setVisible(PAGE);
            }),
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
          {d.shop.price} : {formatPrice(maxPrice)}
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

      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="font-extrabold">
            {d.shop.results(results.length)}
          </p>
          <div className="flex items-center gap-2">
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
              className="field !min-h-11 !w-auto !py-2"
            >
              <option value="new">{d.shop.sortNew}</option>
              <option value="asc">{d.shop.sortAsc}</option>
              <option value="desc">{d.shop.sortDesc}</option>
            </select>
          </div>
        </div>

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
            {results.slice(0, visible).map((product, index) => (
              <li key={product.id}>
                <ProductCard product={product} locale={locale} eager={index < 4} />
              </li>
            ))}
          </ul>
        )}

        {visible < results.length && (
          <div className="mt-8 text-center">
            <button type="button" onClick={() => setVisible(visible + PAGE)} className="btn btn-ghost">
              {d.shop.more}
            </button>
          </div>
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
