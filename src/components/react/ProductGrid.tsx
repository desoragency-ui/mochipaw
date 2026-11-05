import type { Locale, Product } from '../../lib/types';
import { ProductCard } from './ProductCard';

interface Props {
  products: Product[];
  locale: Locale;
}

export function ProductGrid({ products, locale }: Props) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} locale={locale} />
        </li>
      ))}
    </ul>
  );
}
