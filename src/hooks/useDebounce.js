/**
 * Debounce Hook
 * Delays updating a value until after a specified delay
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * @template T
 * @param {T} value - Value to debounce
 * @param {number} [delay=500] - Delay in milliseconds
 * @returns {T} Debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
