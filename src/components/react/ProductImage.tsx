import { PawPrint } from 'lucide-react';
import { imagePath, imageSrcSet } from '../../lib/format';

interface Props {
  file?: string;
  alt: string;
  sizes?: string;
  eager?: boolean;
  noImageLabel?: string;
  className?: string;
}

/** Shows a product photo, or a clean brand tile when the real photo is not there yet. */
export function ProductImage({ file, alt, sizes, eager, noImageLabel, className = '' }: Props) {
  if (!file) {
    return (
      <div
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        className={`flex h-full w-full flex-col items-center justify-center gap-2 text-purple/40 ${className}`}
      >
        <PawPrint size={56} aria-hidden="true" />
        {noImageLabel && <span className="text-sm font-bold text-brown/70">{noImageLabel}</span>}
      </div>
    );
  }
  return (
    <img
      src={imagePath('products', file)}
      srcSet={imageSrcSet('products', file)}
      sizes={sizes ?? '(min-width: 1024px) 300px, 50vw'}
      alt={alt}
      width={960}
      height={960}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={`h-full w-full object-contain ${className}`}
    />
  );
}
