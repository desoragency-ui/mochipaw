import { Heart, Menu, UserRound } from 'lucide-react';
import { useState } from 'react';
import { localePath, t } from '../../i18n';
import type { Locale } from '../../lib/types';
import { Drawer } from './Drawer';

interface Props {
  locale: Locale;
  links: { href: string; label: string }[];
  languages?: { code: Locale; label: string; href: string; current: boolean }[];
}

export function MobileNav({ locale, links, languages = [] }: Props) {
  const d = t(locale);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={d.nav.menu}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="grid h-11 w-11 place-items-center rounded-full bg-white transition hover:bg-cream-deep lg:hidden"
      >
        <Menu size={21} aria-hidden="true" />
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} label={d.nav.menu} closeLabel={d.nav.closeMenu} side="start">
        <nav aria-label={d.nav.menu} className="flex h-full flex-col overflow-y-auto bg-purple px-7 pb-8 pt-20 text-cream">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="display block rounded-2xl py-2.5 text-4xl transition hover:text-blush">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          {languages.length > 1 && (
            <div role="group" aria-label={d.nav.language} className="mt-6 flex flex-wrap gap-2 font-extrabold">
              {languages.map((item) => (
                <a
                  key={item.code}
                  href={item.href}
                  lang={item.code}
                  hrefLang={item.code}
                  aria-current={item.current ? 'true' : undefined}
                  className="inline-flex min-h-11 items-center rounded-full px-5 ring-2 ring-cream/40 transition hover:bg-cream/15 aria-[current=true]:bg-cream aria-[current=true]:text-purple aria-[current=true]:ring-cream"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
          <div className="mt-auto flex flex-col gap-2 pt-8 font-extrabold">
            <a href={localePath(locale, '/favoris')} className="flex min-h-11 items-center gap-3">
              <Heart size={20} aria-hidden="true" /> {d.nav.wishlist}
            </a>
            <a href={localePath(locale, '/compte')} className="flex min-h-11 items-center gap-3">
              <UserRound size={20} aria-hidden="true" /> {d.nav.account}
            </a>
          </div>
        </nav>
      </Drawer>
    </>
  );
}
