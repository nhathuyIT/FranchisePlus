import { useState, useEffect } from "react";

/**
 * Delays updating the returned value until `delay` ms have elapsed
 * since the last change to `value`. Useful for API search inputs.
 */
export function useDebounce<T>(value: T, delay = 2000, digit: string): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    if (digit.length < 3 && digit.length > 0) return;

    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay, digit]);

  return debounced;
}
