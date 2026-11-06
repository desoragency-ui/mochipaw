export type Locale = 'fr' | 'ar' | 'ary';

/** `autre` = birds, rodents and fish. They stay out of the Chats and Chiens pages. */
export type PetType = 'chat' | 'chien' | 'tous' | 'autre';

export type StockStatus = 'in_stock' | 'out_of_stock';

export interface Category {
  slug: string;
  name: string;
  description: string;
  pet: PetType;
  image: string;
}

export interface ProductVariant {
  label: string;
  price: number;
  originalPrice?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  category: string;
  pet: PetType;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  variants: ProductVariant[];
  sku: string;
  stock: StockStatus;
  weight?: string;
  attributes: Record<string, string>;
  ingredients?: string;
  nutrition?: string;
  usage?: string;
  featured: boolean;
  isNew: boolean;
  addedOn?: string;
  /** True for demo items. Sample products are always labelled on the site. */
  sample: boolean;
}

export interface CartLine {
  key: string;
  productId: string;
  slug: string;
  name: string;
  variant?: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ShippingZone {
  id: string;
  name: string;
  cities: string[];
  price: number;
  delay?: string;
}

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  notes?: string;
}

export interface OrderSummary {
  number: string;
  createdAt: string;
  customer: OrderCustomer;
  lines: CartLine[];
  subtotal: number;
  shipping: number | null;
  total: number;
  /** demo = nothing was sent to anyone. whatsapp = the customer opened WhatsApp with the order. */
  channel: 'demo' | 'whatsapp';
}
