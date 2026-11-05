import { Minus, Plus } from 'lucide-react';

interface Props {
  value: number;
  onChange: (value: number) => void;
  label: string;
  decreaseLabel: string;
  increaseLabel: string;
  min?: number;
  small?: boolean;
}

export function QuantityStepper({ value, onChange, label, decreaseLabel, increaseLabel, min = 1, small }: Props) {
  const size = small ? 'h-9 w-9' : 'h-12 w-12';
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-full bg-white shadow-[inset_0_0_0_2px_var(--color-cream-deep)]">
      <button
        type="button"
        aria-label={decreaseLabel}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={`grid ${size} place-items-center rounded-full transition hover:bg-cream-deep active:scale-90 disabled:opacity-35`}
      >
        <Minus size={small ? 15 : 18} aria-hidden="true" />
      </button>
      <span aria-live="polite" className={`min-w-7 text-center font-extrabold ${small ? 'text-sm' : ''}`}>
        {value}
      </span>
      <button
        type="button"
        aria-label={increaseLabel}
        onClick={() => onChange(value + 1)}
        className={`grid ${size} place-items-center rounded-full transition hover:bg-cream-deep active:scale-90`}
      >
        <Plus size={small ? 15 : 18} aria-hidden="true" />
      </button>
    </div>
  );
}
