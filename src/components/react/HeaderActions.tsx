import { Heart, Search, ShoppingBag, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { localePath, t } from '../../i18n';
import { $cartCount, $cartOpen, $searchOpen, $wishlist } from '../../lib/stores';
import type { Locale } from '../../lib/types';
import { useClientStore } from './hooks';

const circle =
  'relative grid h-11 w-11 place-items-center rounded-full bg-white transition duration-200 hover:scale-105 hover:bg-cream-deep active:scale-95';

export function HeaderActions({ locale }: { locale: Locale }) {
  const d = t(locale);
  const count = useClientStore($cartCount, 0);
  const liked = useClientStore($wishlist, []).length;
  const [bump, setBump] = useState(false);
  const previous = useRef(count);

  useEffect(() => {
    if (count > previous.current) {
      setBump(true);
      const timer = window.setTimeout(() => setBump(false), 420);
      previous.current = count;
      return () => window.clearTimeout(timer);
    }
    previous.current = count;
  }, [count]);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2.5">
      <button type="button" aria-label={d.nav.search} onClick={() => $searchOpen.set(true)} className={circle}>
        <Search size={19} aria-hidden="true" />
      </button>
      <a href={localePath(locale, '/compte')} aria-label={d.nav.account} className={`${circle} hidden sm:grid`}>
        <UserRound size={19} aria-hidden="true" />
      </a>
      <a href={localePath(locale, '/favoris')} aria-label={`${d.nav.wishlist} (${liked})`} className={`${circle} hidden sm:grid`}>
        <Heart size={19} aria-hidden="true" />
        {liked > 0 && (
          <span className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-purple px-1 text-xs font-extrabold text-white">
            {liked}
          </span>
        )}
      </a>
      <button
        type="button"
        aria-label={`${d.nav.cart} (${d.cart.items(count)})`}
        onClick={() => $cartOpen.set(true)}
        className={`${circle} !bg-orange text-brown hover:!bg-[#ff734f] ${bump ? 'scale-125' : ''}`}
      >
        <ShoppingBag size={19} aria-hidden="true" />
        {count > 0 && (
          <span className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brown px-1 text-xs font-extrabold text-cream">
            {count}
          </span>
        )}
      </button>
    </div>
  );
}
