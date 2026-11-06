import type { Category } from '../lib/types';

/** The shop's categories. `image` is a file in public/images/categories. */
export const categories: Category[] = [
  {
    slug: 'nourriture-chat',
    name: 'Nourriture chat',
    description: 'Croquettes, pâtées et friandises pour nourrir votre chat chaque jour.',
    pet: 'chat',
    image: 'cat-food',
  },
  {
    slug: 'nourriture-chien',
    name: 'Nourriture chien',
    description: 'Croquettes, pâtées et friandises pour les chiens de toutes tailles.',
    pet: 'chien',
    image: 'dog-food',
  },
  {
    slug: 'litiere',
    name: 'Litière',
    description: 'Litières et accessoires pour le coin de votre chat.',
    pet: 'chat',
    image: 'cat-litter',
  },
  {
    slug: 'accessoires',
    name: 'Accessoires',
    description: 'Colliers, laisses, jouets, brosses et petits indispensables.',
    pet: 'tous',
    image: 'accessories',
  },
];

export const categoryBySlug = (slug: string) => categories.find((item) => item.slug === slug);
