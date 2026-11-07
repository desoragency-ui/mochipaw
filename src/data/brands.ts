/**
 * The brands shown in the moving "Nos marques" band on the home page.
 * `name` must match the `brand` column of products.csv: a click opens the shop filtered on it.
 * `dark` = a white logo, shown on a dark card. Logo files: public/images/brands (made by tools/make-brand-logos.py).
 */
export interface Brand {
  slug: string;
  name: string;
  logo: string;
  dark?: boolean;
}

export const brands: Brand[] = [
  { slug: 'royal-canin', name: 'Royal Canin', logo: '/images/brands/royal-canin.svg' },
  { slug: 'pro-plan', name: 'Pro Plan', logo: '/images/brands/pro-plan.png', dark: true },
  { slug: 'felix', name: 'Felix', logo: '/images/brands/felix.png' },
  { slug: 'brit', name: 'Brit', logo: '/images/brands/brit.svg' },
  { slug: 'ownat', name: 'Ownat', logo: '/images/brands/ownat.svg' },
  { slug: 'hills', name: "Hill's", logo: '/images/brands/hills.png' },
  { slug: 'monge', name: 'Monge', logo: '/images/brands/monge.svg', dark: true },
  { slug: 'mera', name: 'Mera', logo: '/images/brands/mera.svg' },
  { slug: 'reflex-plus', name: 'Reflex Plus', logo: '/images/brands/reflex-plus.png' },
];
