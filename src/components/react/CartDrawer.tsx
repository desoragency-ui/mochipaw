import { localePath, t } from '../../i18n';
import { formatPrice } from '../../lib/format';
import { $cart, $cartOpen, $cartSubtotal } from '../../lib/stores';
import type { Locale } from '../../lib/types';
import { CartLines } from './CartLines';
import { Drawer } from './Drawer';
import { useClientStore } from './hooks';

export function CartDrawer({ locale }: { locale: Locale }) {
  const d = t(locale);
  const open = useClientStore($cartOpen, false);
  const lines = useClientStore($cart, []);
  const subtotal = useClientStore($cartSubtotal, 0);
  const close = () => $cartOpen.set(false);

  return (
    <Drawer open={open} onClose={close} label={d.cart.title} closeLabel={d.cart.close}>
      <h2 className="display px-6 pb-4 pt-6 text-3xl text-purple">{d.cart.title}</h2>
      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 pb-16 text-center">
          <img
            src="/images/photos/empty-cart-480.webp"
            alt=""
            width={480}
            height={480}
            loading="lazy"
            className="h-44 w-44 object-contain"
            onError={(event) => event.currentTarget.remove()}
          />
          <p className="font-display text-2xl font-semibold">{d.cart.empty}</p>
          <p className="text-brown/70">{d.cart.emptyText}</p>
          <a href={localePath(locale, '/boutique')} className="btn btn-purple mt-2">
            {d.cart.emptyCta}
          </a>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <CartLines lines={lines} locale={locale} />
          </div>
          <div className="flex flex-col gap-3 rounded-t-[28px] bg-white px-6 pb-6 pt-5 shadow-soft">
            <p className="flex items-center justify-between font-extrabold">
              <span>{d.cart.subtotal}</span>
              <span className="font-display text-2xl font-semibold">{formatPrice(subtotal)}</span>
            </p>
            <a href={localePath(locale, '/commande')} className="btn btn-purple w-full">
              {d.cart.checkout}
            </a>
            <a href={localePath(locale, '/panier')} className="text-center font-extrabold text-purple underline-offset-4 hover:underline">
              {d.cart.view}
            </a>
          </div>
        </>
      )}
    </Drawer>
  );
}
