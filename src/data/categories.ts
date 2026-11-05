import type { Category } from '../lib/types';

/** The shop's categories. `image` is a file in public/images/categories. */
export const categories: Category[] = [
  {
    slug: 'nourriture-chat',
    name: 'Nourriture chat',
    description: 'Croquettes et pâtées pour nourrir votre chat chaque jour.',
    pet: 'chat',
    image: 'cat-food',
  },
  {
    slug: 'nourriture-chien',
    name: 'Nourriture chien',
    description: 'Croquettes et pâtées pour les chiens de toutes tailles.',
    pet: 'chien',
    image: 'dog-food',
  },
  {
    slug: 'friandises',
    name: 'Friandises',
    description: 'De petites récompenses pour les chats et les chiens.',
    pet: 'tous',
    image: 'treats',
  },
  {
    slug: 'jouets',
    name: 'Jouets',
    description: 'De quoi jouer, mordiller et se dépenser.',
    pet: 'tous',
    image: 'toys',
  },
  {
    slug: 'toilettage',
    name: 'Toilettage',
    description: 'Brosses et soins du quotidien pour le pelage.',
    pet: 'tous',
    image: 'grooming',
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
    description: 'Colliers, laisses et petits indispensables.',
    pet: 'tous',
    image: 'accessories',
  },
];

export const categoryBySlug = (slug: string) => categories.find((item) => item.slug === slug);
