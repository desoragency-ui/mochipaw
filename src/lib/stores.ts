import { atom, computed } from 'nanostores';
import type { CartLine, OrderSummary } from './types';

const CART_KEY = 'mochipaw.cart.v1';
const WISHLIST_KEY = 'mochipaw.wishlist.v1';
const ORDER_KEY = 'mochipaw.lastOrder.v1';

const isBrowser = typeof window !== 'undefined';

function read<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or full storage: the cart still works for this visit.
  }
}

export const $cart = atom<CartLine[]>([]);
export const $wishlist = atom<string[]>([]);
export const $cartOpen = atom(false);
export const $searchOpen = atom(false);
export const $lastAdded = atom<string | null>(null);

if (isBrowser) {
  $cart.set(read<CartLine[]>(CART_KEY, []));
  $wishlist.set(read<string[]>(WISHLIST_KEY, []));
  $cart.listen((lines) => write(CART_KEY, lines));
  $wishlist.listen((ids) => write(WISHLIST_KEY, ids));

  // Keep several open tabs in step.
  window.addEventListener('storage', (event) => {
    if (event.key === CART_KEY) $cart.set(read<CartLine[]>(CART_KEY, []));
    if (event.key === WISHLIST_KEY) $wishlist.set(read<string[]>(WISHLIST_KEY, []));
  });
}

export const $cartCount = computed($cart, (lines) =>
  lines.reduce((sum, line) => sum + line.quantity, 0),
);

export const $cartSubtotal = computed($cart, (lines) =>
  lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
);

export function lineKey(productId: string, variant?: string) {
  return variant ? `${productId}::${variant}` : productId;
}

export function addToCart(line: Omit<CartLine, 'key' | 'quantity'>, quantity = 1) {
  const key = lineKey(line.productId, line.variant);
  const lines = $cart.get();
  const existing = lines.find((item) => item.key === key);
  $cart.set(
    existing
      ? lines.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item,
        )
      : [...lines, { ...line, key, quantity }],
  );
  $lastAdded.set(key);
}

export function setQuantity(key: string, quantity: number) {
  if (quantity < 1) return removeFromCart(key);
  $cart.set($cart.get().map((item) => (item.key === key ? { ...item, quantity } : item)));
}

export function removeFromCart(key: string) {
  $cart.set($cart.get().filter((item) => item.key !== key));
}

export function clearCart() {
  $cart.set([]);
}

export function toggleWishlist(productId: string) {
  const ids = $wishlist.get();
  $wishlist.set(
    ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId],
  );
}

export function saveLastOrder(order: OrderSummary) {
  write(ORDER_KEY, order);
}

export function readLastOrder() {
  return read<OrderSummary | null>(ORDER_KEY, null);
}
