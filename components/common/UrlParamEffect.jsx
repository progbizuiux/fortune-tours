"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/* Calls `onChange` with the value of one query param whenever it changes —
 * including to null when the param is dropped — so a client-side navigation
 * that only changes the query (/journal?category=guides → /journal) reaches
 * state that lives in a component Next does not remount for it.
 *
 * Kept to this one tiny component on purpose. useSearchParams() makes the
 * tree up to the nearest Suspense boundary render on the client on a
 * statically prerendered page, so a caller wraps THIS in <Suspense
 * fallback={null}> and keeps everything else server-rendered:
 *
 *   <Suspense fallback={null}>
 *     <UrlParamEffect name="category" onChange={applyCategory} />
 *   </Suspense>
 *
 * Renders nothing. `onChange` should be stable (useCallback) or tolerant of
 * running once per render of its parent. */
export function UrlParamEffect({ name, onChange }) {
  const value = useSearchParams().get(name);

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  return null;
}
