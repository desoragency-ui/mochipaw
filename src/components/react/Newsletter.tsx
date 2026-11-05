import { Check } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { site } from '../../data/site';
import { t } from '../../i18n';
import type { Locale } from '../../lib/types';

type State = 'idle' | 'invalid' | 'done' | 'demo';

export function Newsletter({ locale }: { locale: Locale }) {
  const d = t(locale);
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState('invalid');
    if (!site.newsletter.endpoint) return setState('demo');
    await fetch(site.newsletter.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setState('done');
  };

  if (state === 'done' || state === 'demo') {
    return (
      <p role="status" className="flex items-center gap-3 rounded-3xl bg-white px-5 py-4 font-extrabold text-purple">
        <Check size={22} aria-hidden="true" />
        {state === 'done' ? d.newsletter.success : d.newsletter.demo}
      </p>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
      <div className="flex-1">
        <label htmlFor="newsletter-email" className="sr-only">
          {d.newsletter.label}
        </label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          value={email}
          aria-invalid={state === 'invalid' ? true : undefined}
          aria-describedby={state === 'invalid' ? 'newsletter-error' : undefined}
          placeholder={d.newsletter.placeholder}
          onChange={(event) => {
            setEmail(event.target.value);
            if (state === 'invalid') setState('idle');
          }}
          className="field !rounded-full !border-0"
        />
        {state === 'invalid' && (
          <p id="newsletter-error" className="mt-1.5 ps-4 text-sm font-extrabold">
            {d.newsletter.invalid}
          </p>
        )}
      </div>
      <button type="submit" className="btn btn-purple !min-h-[3.25rem] shrink-0">
        {d.newsletter.button}
      </button>
    </form>
  );
}
