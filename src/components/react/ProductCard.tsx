import { Check, Heart, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { localePath, t } from '../../i18n';
import { discountPercent } from '../../lib/format';
import { $cartOpen, $wishlist, addToCart, toggleWishlist } from '../../lib/stores';
import type { Locale, Product } from '../../lib/types';
import { useClientStore } from './hooks';
import { Price } from './Price';
import { ProductImage } from './ProductImage';

interface Props {
  product: Product;
  locale: Locale;
  eager?: boolean;
}

export function ProductCard({ product, locale, eager }: Props) {
  const d = t(locale);
  const href = localePath(locale, `/produit/${product.slug}`);
  const wishlist = useClientStore($wishlist, []);
  const liked = wishlist.includes(product.id);
  const off = discountPercent(product);
  const needsChoice = product.variants.length > 1;
  const soldOut = product.stock === 'out_of_stock';
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1400);
    return () => window.clearTimeout(timer);
  }, [added]);

  const quickAdd = () => {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? '',
    });
    setAdded(true);
    $cartOpen.set(true);
  };

  return (
    <article className="group relative flex h-full flex-col rounded-card bg-white p-3 shadow-[0_2px_0_var(--color-cream-deep)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden rounded-[20px] bg-cream">
        <a href={href} tabIndex={-1} aria-hidden="true" className="block h-full p-4">
          <ProductImage
            file={product.images[0]}
            alt=""
            eager={eager}
            noImageLabel={d.product.noImage}
            className="transition duration-500 ease-out group-hover:scale-105"
          />
        </a>
        <div className="pointer-events-none absolute start-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {off !== null && <span className="rounded-full bg-orange px-2.5 py-0.5 text-xs font-extrabold text-brown">-{off} %</span>}
          {product.sample && <span className="rounded-full bg-brown/85 px-2.5 py-0.5 text-xs font-bold text-cream">{d.demo.tag}</span>}
        </div>
        <button
          type="button"
          aria-pressed={liked}
          aria-label={`${liked ? d.product.wishlistRemove : d.product.wishlistAdd} : ${product.name}`}
          onClick={() => toggleWishlist(product.id)}
          className="absolute end-2 top-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white shadow-soft transition duration-200 hover:scale-110 active:scale-90"
        >
          <Heart size={19} aria-hidden="true" className={liked ? 'fill-orange text-orange' : 'text-brown'} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-1.5 pb-1 pt-3">
        {product.brand && <p className="text-xs font-bold uppercase tracking-wide text-brown/70">{product.brand}</p>}
        <h3 className="font-sans text-base font-extrabold leading-snug">
          <a href={href} className="after:absolute after:inset-0 after:rounded-card hover:text-purple">
            {product.name}
          </a>
        </h3>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-2 gap-y-2 pt-2">
          <Price price={product.price} originalPrice={product.originalPrice} locale={locale} />
          {soldOut ? (
            <span className="relative z-10 rounded-full bg-cream-deep px-3 py-2 text-xs font-extrabold">{d.product.outOfStock}</span>
          ) : needsChoice ? (
            <a href={href} className="btn btn-ghost relative z-10 !min-h-11 !px-3.5 !py-2 text-sm">
              {d.product.choose}
            </a>
          ) : (
            <button
              type="button"
              onClick={quickAdd}
              aria-label={`${d.product.addToCart} : ${product.name}`}
              className={`relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full text-white transition duration-200 hover:scale-110 active:scale-90 ${
                added ? 'bg-brown' : 'bg-purple hover:bg-purple-deep'
              }`}
            >
              {added ? <Check size={20} aria-hidden="true" /> : <Plus size={20} aria-hidden="true" />}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
