import { useEffect, useState } from 'react';
import { hasWhatsApp, site } from '../../data/site';
import { localePath, t } from '../../i18n';
import { formatPrice } from '../../lib/format';
import { readLastOrder } from '../../lib/stores';
import type { Locale, OrderSummary } from '../../lib/types';

export function OrderSuccess({ locale }: { locale: Locale }) {
  const d = t(locale);
  const [order, setOrder] = useState<OrderSummary | null | undefined>(undefined);
  useEffect(() => setOrder(readLastOrder()), []);

  if (order === undefined) return <div className="h-64" aria-hidden="true" />;

  if (order === null) {
    return (
      <div className="rounded-panel bg-white px-6 py-14 text-center">
        <p className="font-display text-2xl font-semibold">{d.success.missing}</p>
        <a href={localePath(locale, '/boutique')} className="btn btn-purple mt-5">
          {d.success.back}
        </a>
      </div>
    );
  }

  const demo = order.channel === 'demo';

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_1fr]">
      <section className="relative overflow-hidden rounded-panel bg-purple p-8 text-cream sm:p-10">
        <span className="absolute -bottom-20 -end-16 h-60 w-60 rounded-[58%_42%_46%_54%/56%_48%_52%_44%] bg-orange" aria-hidden="true" />
        <div className="relative">
          <p className="display text-6xl sm:text-7xl">{demo ? d.success.titleDemo : d.success.title}</p>
          <p className="mt-4 max-w-md text-lg font-bold">{demo ? d.success.textDemo : d.success.text}</p>
          <p className="mt-6 text-sm font-bold opacity-85">{d.success.number}</p>
          <p className="font-display text-3xl font-semibold">{order.number}</p>
          <a href={localePath(locale, '/boutique')} className="btn btn-cream mt-6">
            {d.success.back}
          </a>
          <img
            src="/images/photos/order-success-960.webp"
            alt={d.alts.orderSuccess}
            width={960}
            height={720}
            loading="lazy"
            className="mt-6 w-full rounded-card"
            onError={(event) => event.currentTarget.remove()}
          />
        </div>
      </section>

      <div className="flex flex-col gap-4">
        <section className="rounded-card bg-white p-6">
          <h2 className="mb-3 text-2xl">{d.checkout.summary}</h2>
          <ul className="flex flex-col gap-1.5">
            {order.lines.map((line) => (
              <li key={line.key} className="flex justify-between gap-4 font-semibold">
                <span>
                  {line.quantity} × {line.name}
                  {line.variant ? ` (${line.variant})` : ''}
                </span>
                <span className="shrink-0 font-extrabold">{formatPrice(line.price * line.quantity, locale)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex justify-between border-t-2 border-cream-deep pt-3 font-extrabold">
            <span>{d.cart.total}</span>
            <span>{formatPrice(order.total, locale)}</span>
          </p>
        </section>
        <section className="rounded-card bg-white p-6">
          <h2 className="mb-2 text-2xl">{d.success.delivery}</h2>
          <p className="font-semibold">
            {order.customer.fullName}
            <br />
            {order.customer.phone}
            <br />
            {order.customer.address}, {order.customer.city}
          </p>
        </section>
        {!demo && (
          <section className="rounded-card bg-white p-6">
            <h2 className="mb-2 text-2xl">{d.success.next}</h2>
            <ol className="list-decimal ps-5 font-semibold">
              {d.success.nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        )}
        {hasWhatsApp() && (
          <a href={`https://wa.me/${site.contact.whatsapp}`} className="btn btn-ghost">
            {d.success.support}
          </a>
        )}
      </div>
    </div>
  );
}
