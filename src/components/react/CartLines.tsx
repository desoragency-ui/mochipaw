import { Trash2 } from 'lucide-react';
import { localePath, t } from '../../i18n';
import { formatPrice } from '../../lib/format';
import { removeFromCart, setQuantity } from '../../lib/stores';
import type { CartLine, Locale } from '../../lib/types';
import { ProductImage } from './ProductImage';
import { QuantityStepper } from './QuantityStepper';

interface Props {
  lines: CartLine[];
  locale: Locale;
  roomy?: boolean;
}

export function CartLines({ lines, locale, roomy }: Props) {
  const d = t(locale);
  return (
    <ul className="flex flex-col gap-3">
      {lines.map((line) => (
        <li key={line.key} className={`flex gap-3 rounded-3xl bg-white ${roomy ? 'p-4' : 'p-3'}`}>
          <a
            href={localePath(locale, `/produit/${line.slug}`)}
            className={`shrink-0 overflow-hidden rounded-2xl bg-cream p-1.5 ${roomy ? 'h-28 w-28' : 'h-20 w-20'}`}
          >
            <ProductImage file={line.image || undefined} alt="" sizes="112px" />
          </a>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <a href={localePath(locale, `/produit/${line.slug}`)} className="font-extrabold leading-snug hover:text-purple">
                  {line.name}
                </a>
                {line.variant && <p className="text-sm font-semibold text-brown/70">{line.variant}</p>}
                {roomy && (
                  <p className="text-sm text-brown/70">
                    {d.cart.unit} : {formatPrice(line.price)}
                  </p>
                )}
              </div>
              <button
                type="button"
                aria-label={`${d.cart.remove} : ${line.name}`}
                onClick={() => removeFromCart(line.key)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-brown/70 transition hover:bg-cream hover:text-orange-deep"
              >
                <Trash2 size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="mt-auto flex items-center justify-between gap-2">
              <QuantityStepper
                small
                value={line.quantity}
                onChange={(value) => setQuantity(line.key, value)}
                label={d.product.quantity}
                decreaseLabel={d.product.decrease}
                increaseLabel={d.product.increase}
              />
              <span className="font-display text-lg font-semibold">{formatPrice(line.price * line.quantity)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
