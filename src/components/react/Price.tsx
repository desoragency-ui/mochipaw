import { formatPrice } from '../../lib/format';

interface Props {
  price: number;
  originalPrice?: number;
  large?: boolean;
}

export function Price({ price, originalPrice, large }: Props) {
  const reduced = originalPrice !== undefined && originalPrice > price;
  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className={`font-display font-semibold ${large ? 'text-3xl' : 'text-xl'} ${reduced ? 'text-orange-deep' : 'text-brown'}`}>
        {formatPrice(price)}
      </span>
      {reduced && <s className={`${large ? 'text-lg' : 'text-sm'} font-semibold text-brown/70`}>{formatPrice(originalPrice)}</s>}
    </p>
  );
}
