import { MessageCircle } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { checkoutIsLive, site } from '../../data/site';
import { localePath, t } from '../../i18n';
import { formatPrice } from '../../lib/format';
import { normalizeMoroccanPhone } from '../../lib/phone';
import { $cart, $cartSubtotal, clearCart, saveLastOrder } from '../../lib/stores';
import type { Locale, OrderCustomer, OrderSummary } from '../../lib/types';
import { useClientStore } from './hooks';
import { ProductImage } from './ProductImage';

type Errors = Partial<Record<keyof OrderCustomer, string>>;

const empty: OrderCustomer = { fullName: '', phone: '', email: '', city: '', address: '', notes: '' };

function shippingFor(city: string) {
  const name = city.trim().toLowerCase();
  const zone = site.shippingZones.find((item) => item.cities.some((entry) => entry.toLowerCase() === name));
  return zone ? zone.price : null;
}

export function CheckoutForm({ locale }: { locale: Locale }) {
  const d = t(locale);
  const lines = useClientStore($cart, []);
  const subtotal = useClientStore($cartSubtotal, 0);
  const [customer, setCustomer] = useState<OrderCustomer>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const live = checkoutIsLive();

  const shipping = shippingFor(customer.city);
  const total = subtotal + (shipping ?? 0);

  const update = (key: keyof OrderCustomer, value: string) => {
    setCustomer({ ...customer, [key]: value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  };

  const validate = () => {
    const found: Errors = {};
    if (!customer.fullName.trim()) found.fullName = d.checkout.required;
    if (!normalizeMoroccanPhone(customer.phone)) found.phone = d.checkout.badPhone;
    if (customer.email && !/^\S+@\S+\.\S+$/.test(customer.email)) found.email = d.checkout.badEmail;
    if (!customer.city.trim()) found.city = d.checkout.required;
    if (!customer.address.trim()) found.address = d.checkout.required;
    return found;
  };

  const whatsappText = (order: OrderSummary) =>
    [
      d.checkout.whatsappIntro,
      `${d.success.number} : ${order.number}`,
      ...order.lines.map(
        (line) => `- ${line.quantity} x ${line.name}${line.variant ? ` (${line.variant})` : ''} : ${formatPrice(line.price * line.quantity)}`,
      ),
      `${d.cart.total} : ${formatPrice(order.total)}`,
      `${d.checkout.fullName} : ${order.customer.fullName}`,
      `${d.checkout.phone} : ${order.customer.phone}`,
      `${d.checkout.city} : ${order.customer.city}`,
      `${d.checkout.addressLine} : ${order.customer.address}`,
      order.customer.notes ? `${d.checkout.notes} : ${order.customer.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`field-${first}`)?.focus();
      return;
    }

    const order: OrderSummary = {
      number: `MP-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      customer,
      lines,
      subtotal,
      shipping,
      total,
      channel: live ? 'whatsapp' : 'demo',
    };
    saveLastOrder(order);
    if (live) {
      window.open(`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(whatsappText(order))}`, '_blank', 'noopener');
    }
    clearCart();
    window.location.href = localePath(locale, '/confirmation');
  };

  if (lines.length === 0) {
    return (
      <div className="rounded-panel bg-white px-6 py-14 text-center">
        <p className="font-display text-2xl font-semibold">{d.checkout.emptyCart}</p>
        <a href={localePath(locale, '/boutique')} className="btn btn-purple mt-5">
          {d.cart.emptyCta}
        </a>
      </div>
    );
  }

  const field = (key: keyof OrderCustomer, label: string, options: { type?: string; hint?: string; auto?: string; area?: boolean } = {}) => {
    const id = `field-${key}`;
    const error = errors[key];
    const shared = {
      id,
      value: customer[key] ?? '',
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `${id}-error` : options.hint ? `${id}-hint` : undefined,
      className: 'field',
      autoComplete: options.auto,
    };
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block font-extrabold">
          {label}
        </label>
        {options.area ? (
          <textarea {...shared} rows={3} onChange={(event) => update(key, event.target.value)} />
        ) : (
          <input {...shared} type={options.type ?? 'text'} onChange={(event) => update(key, event.target.value)} />
        )}
        {options.hint && !error && (
          <p id={`${id}-hint`} className="mt-1 text-sm text-brown/70">
            {options.hint}
          </p>
        )}
        {error && (
          <p id={`${id}-error`} className="mt-1 text-sm font-bold text-orange-deep">
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <form noValidate onSubmit={submit} className="grid items-start gap-6 lg:grid-cols-[1fr_400px]">
      <div className="flex flex-col gap-6">
        {!live && <p className="rounded-3xl bg-blush px-5 py-3 font-extrabold">{d.demo.checkout}</p>}
        <section className="flex flex-col gap-4 rounded-card bg-white p-6">
          <h2 className="text-2xl">{d.checkout.contact}</h2>
          {field('fullName', d.checkout.fullName, { auto: 'name' })}
          {field('phone', d.checkout.phone, { type: 'tel', hint: d.checkout.phoneHint, auto: 'tel' })}
          {field('email', d.checkout.email, { type: 'email', auto: 'email' })}
        </section>
        <section className="flex flex-col gap-4 rounded-card bg-white p-6">
          <h2 className="text-2xl">{d.checkout.address}</h2>
          {field('city', d.checkout.city, { auto: 'address-level2' })}
          {field('address', d.checkout.addressLine, { auto: 'street-address' })}
          {field('notes', d.checkout.notes, { area: true })}
        </section>
        <section className="rounded-card bg-white p-6">
          <h2 className="mb-2 text-2xl">{d.checkout.payment}</h2>
          <p className="font-extrabold text-purple">{d.checkout.cod}</p>
        </section>
      </div>

      <aside className="flex flex-col gap-3 rounded-card bg-white p-6 lg:sticky lg:top-28">
        <h2 className="text-2xl">{d.checkout.summary}</h2>
        <ul className="flex flex-col gap-2.5">
          {lines.map((line) => (
            <li key={line.key} className="flex items-center gap-3">
              <span className="h-14 w-14 shrink-0 rounded-xl bg-cream p-1">
                <ProductImage file={line.image || undefined} alt="" sizes="56px" />
              </span>
              <span className="min-w-0 flex-1 text-sm font-bold leading-snug">
                {line.quantity} × {line.name}
                {line.variant && <span className="block font-semibold text-brown/70">{line.variant}</span>}
              </span>
              <span className="font-extrabold">{formatPrice(line.price * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-1 flex justify-between border-t-2 border-cream-deep pt-3 font-semibold">
          <span>{d.cart.subtotal}</span>
          <span>{formatPrice(subtotal)}</span>
        </p>
        <p className="flex justify-between gap-4 font-semibold">
          <span>{d.cart.shipping}</span>
          <span className="text-end text-brown/70">{shipping === null ? d.cart.shippingTbd : formatPrice(shipping)}</span>
        </p>
        <p className="flex items-center justify-between font-extrabold">
          <span>{d.cart.total}</span>
          <span className="font-display text-2xl font-semibold">{formatPrice(total)}</span>
        </p>
        <button type="submit" className="btn btn-purple mt-1 w-full">
          <MessageCircle size={19} aria-hidden="true" />
          {live ? d.checkout.confirm : d.checkout.confirmDemo}
        </button>
      </aside>
    </form>
  );
}
