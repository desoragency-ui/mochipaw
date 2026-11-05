import { localePath, t } from '../../i18n';
import { formatPrice } from '../../lib/format';
import { $cart, $cartSubtotal } from '../../lib/stores';
import type { Locale } from '../../lib/types';
import { CartLines } from './CartLines';
import { useClientStore } from './hooks';

export function CartPage({ locale }: { locale: Locale }) {
  const d = t(locale);
  const lines = useClientStore($cart, []);
  const subtotal = useClientStore($cartSubtotal, 0);

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-panel bg-white px-6 py-16 text-center">
        <img
            src="/images/photos/empty-cart-480.webp"
            alt=""
            width={480}
            height={480}
            loading="lazy"
            className="h-44 w-44 object-contain"
            onError={(event) => event.currentTarget.remove()}
          />
        <h2 className="font-display text-3xl font-semibold">{d.cart.empty}</h2>
        <p className="text-brown/70">{d.cart.emptyText}</p>
        <a href={localePath(locale, '/boutique')} className="btn btn-purple mt-2">
          {d.cart.emptyCta}
        </a>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
      <CartLines lines={lines} locale={locale} roomy />
      <aside className="flex flex-col gap-3 rounded-card bg-white p-6 lg:sticky lg:top-28">
        <p className="flex justify-between font-semibold">
          <span>{d.cart.subtotal}</span>
          <span>{formatPrice(subtotal)}</span>
        </p>
        <p className="flex justify-between gap-4 font-semibold">
          <span>{d.cart.shipping}</span>
          <span className="text-end text-brown/70">{d.cart.shippingTbd}</span>
        </p>
        <p className="flex items-center justify-between border-t-2 border-cream-deep pt-3 font-extrabold">
          <span>{d.cart.total}</span>
          <span className="font-display text-2xl font-semibold">{formatPrice(subtotal)}</span>
        </p>
        <a href={localePath(locale, '/commande')} className="btn btn-purple mt-1 w-full">
          {d.cart.checkout}
        </a>
        <a href={localePath(locale, '/boutique')} className="text-center font-extrabold text-purple underline-offset-4 hover:underline">
          {d.cart.continue}
        </a>
      </aside>
    </div>
  );
}
