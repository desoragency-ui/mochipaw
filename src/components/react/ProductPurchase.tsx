import { Check, Heart, ShoppingBag, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { t } from '../../i18n';
import { discountPercent, formatPrice } from '../../lib/format';
import { $cartOpen, $wishlist, addToCart, toggleWishlist } from '../../lib/stores';
import type { Locale, Product } from '../../lib/types';
import { useClientStore } from './hooks';
import { Price } from './Price';
import { QuantityStepper } from './QuantityStepper';

interface Props {
  product: Product;
  locale: Locale;
}

export function ProductPurchase({ product, locale }: Props) {
  const d = t(locale);
  const [variantIndex, setVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const liked = useClientStore($wishlist, []).includes(product.id);

  const variant = product.variants[variantIndex];
  const price = variant?.price ?? product.price;
  const originalPrice = variant ? variant.originalPrice : product.originalPrice;
  const off = discountPercent({ price, originalPrice });
  const soldOut = product.stock === 'out_of_stock';

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);

  const add = () => {
    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        variant: variant?.label,
        price,
        image: product.images[0] ?? '',
      },
      quantity,
    );
    setAdded(true);
    $cartOpen.set(true);
  };

  const addLabel = added ? d.product.added : soldOut ? d.product.outOfStock : d.product.addToCart;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <Price price={price} originalPrice={originalPrice} large locale={locale} />
        {off !== null && (
          <span className="rounded-full bg-orange px-3 py-1 text-sm font-extrabold text-brown">
            -{off} % {d.product.off}
          </span>
        )}
      </div>

      <p className={`flex items-center gap-2 font-extrabold ${soldOut ? 'text-orange-deep' : 'text-purple'}`}>
        <span className={`h-2.5 w-2.5 rounded-full ${soldOut ? 'bg-orange-deep' : 'bg-purple'}`} aria-hidden="true" />
        {soldOut ? d.product.outOfStock : d.product.inStock}
      </p>

      {product.variants.length > 1 && (
        <fieldset>
          <legend className="mb-2 font-extrabold">{d.product.variant}</legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((item, index) => (
              <label
                key={item.label}
                className={`cursor-pointer rounded-full px-4 py-2.5 font-extrabold transition has-focus-visible:outline-3 has-focus-visible:outline-orange ${
                  index === variantIndex ? 'bg-purple text-white' : 'bg-white hover:bg-cream-deep'
                }`}
              >
                <input
                  type="radio"
                  name="variant"
                  checked={index === variantIndex}
                  onChange={() => setVariantIndex(index)}
                  className="sr-only"
                />
                {item.label} · {formatPrice(item.price, locale)}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          label={d.product.quantity}
          decreaseLabel={d.product.decrease}
          increaseLabel={d.product.increase}
        />
        <button type="button" disabled={soldOut} onClick={add} className="btn btn-purple min-w-56 flex-1 disabled:cursor-not-allowed disabled:opacity-50">
          {added ? <Check size={19} aria-hidden="true" /> : <ShoppingBag size={19} aria-hidden="true" />}
          {addLabel}
        </button>
        <button
          type="button"
          aria-pressed={liked}
          aria-label={liked ? d.product.wishlistRemove : d.product.wishlistAdd}
          onClick={() => toggleWishlist(product.id)}
          className="grid h-12 w-12 place-items-center rounded-full bg-white transition hover:scale-105 active:scale-90"
        >
          <Heart size={21} aria-hidden="true" className={liked ? 'fill-orange text-orange' : ''} />
        </button>
      </div>

      <p className="flex items-start gap-3 rounded-3xl bg-white p-4 font-semibold">
        <Truck size={21} aria-hidden="true" className="mt-0.5 shrink-0 text-purple" />
        <span>
          <strong className="font-extrabold">{d.product.delivery} : </strong>
          {d.product.deliveryText}
        </span>
      </p>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(34,15,6,.12)] lg:hidden">
        <span className="font-display text-xl font-semibold">{formatPrice(price, locale)}</span>
        <button type="button" disabled={soldOut} onClick={add} className="btn btn-purple flex-1 disabled:opacity-50">
          {addLabel}
        </button>
      </div>
    </div>
  );
}
