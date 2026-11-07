import { Heart } from 'lucide-react';
import { localePath, t } from '../../i18n';
import { $wishlist } from '../../lib/stores';
import type { Locale } from '../../lib/types';
import { useClientStore } from './hooks';
import { ProductGrid } from './ProductGrid';
import { useCatalog } from './useCatalog';

export function WishlistPage({ locale }: { locale: Locale }) {
  const d = t(locale);
  const ids = useClientStore($wishlist, []);
  const products = useCatalog(locale);
  const liked = (products ?? []).filter((item) => ids.includes(item.id));

  if (ids.length > 0 && !products) return <div className="h-64" aria-hidden="true" />;

  if (liked.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-panel bg-white px-6 py-16 text-center">
        <span className="grid h-28 w-28 place-items-center rounded-full bg-blush text-orange-deep">
          <Heart size={46} aria-hidden="true" />
        </span>
        <h2 className="font-display text-3xl font-semibold">{d.wishlist.empty}</h2>
        <p className="text-brown/70">{d.wishlist.emptyText}</p>
        <a href={localePath(locale, '/boutique')} className="btn btn-purple mt-2">
          {d.wishlist.cta}
        </a>
      </div>
    );
  }

  return <ProductGrid products={liked} locale={locale} />;
}
