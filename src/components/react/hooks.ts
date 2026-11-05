import { useStore } from '@nanostores/react';
import type { ReadableAtom } from 'nanostores';
import { useEffect, useState } from 'react';

/** Reads a store but shows the server value on first paint, so hydration always matches. */
export function useClientStore<T>(store: ReadableAtom<T>, serverValue: T): T {
  const value = useStore(store);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready ? value : serverValue;
}
