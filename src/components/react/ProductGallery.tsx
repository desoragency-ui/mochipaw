import { useState } from 'react';
import { t } from '../../i18n';
import type { Locale } from '../../lib/types';
import { ProductImage } from './ProductImage';

interface Props {
  images: string[];
  name: string;
  locale: Locale;
}

export function ProductGallery({ images, name, locale }: Props) {
  const d = t(locale);
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <button
        type="button"
        aria-label={d.product.zoom}
        aria-pressed={zoomed}
        disabled={images.length === 0}
        onClick={() => setZoomed(!zoomed)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={(event) => {
          const box = event.currentTarget.getBoundingClientRect();
          setOrigin(`${((event.clientX - box.left) / box.width) * 100}% ${((event.clientY - box.top) / box.height) * 100}%`);
        }}
        className={`relative aspect-square w-full overflow-hidden rounded-panel bg-white p-8 ${images.length ? (zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in') : ''}`}
      >
        <span className="absolute -bottom-16 -end-16 h-64 w-64 rounded-[58%_42%_46%_54%/56%_48%_52%_44%] bg-purple/10" aria-hidden="true" />
        <span className="relative block h-full transition-transform duration-300 ease-out" style={{ transform: zoomed ? 'scale(1.9)' : undefined, transformOrigin: origin }}>
          <ProductImage file={images[active]} alt={name} eager sizes="(min-width: 1024px) 600px, 100vw" noImageLabel={d.product.noImage} />
        </span>
      </button>
      {images.length > 1 && (
        <ul className="flex flex-wrap gap-2.5">
          {images.map((file, index) => (
            <li key={file}>
              <button
                type="button"
                aria-label={`${d.product.thumb} ${index + 1}`}
                aria-current={index === active}
                onClick={() => setActive(index)}
                className={`h-20 w-20 overflow-hidden rounded-2xl bg-white p-1.5 transition ${index === active ? 'ring-3 ring-purple' : 'hover:ring-2 hover:ring-cream-deep'}`}
              >
                <ProductImage file={file} alt="" sizes="80px" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
