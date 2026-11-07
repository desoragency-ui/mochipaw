import { formatPrice } from '../../lib/format';
import type { Locale } from '../../lib/types';

interface Props {
  price: number;
  originalPrice?: number;
  large?: boolean;
  locale?: Locale;
}

export function Price({ price, originalPrice, large, locale = 'fr' }: Props) {
  const reduced = originalPrice !== undefined && originalPrice > price;
  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className={`whitespace-nowrap font-display font-semibold ${large ? 'text-3xl' : 'text-xl'} ${reduced ? 'text-orange-deep' : 'text-brown'}`}>
        {formatPrice(price, locale)}
      </span>
      {reduced && <s className={`whitespace-nowrap ${large ? 'text-lg' : 'text-sm'} font-semibold text-brown/70`}>{formatPrice(originalPrice, locale)}</s>}
    </p>
  );
}
