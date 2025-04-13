import { useEffect, useRef, useState } from 'react';

/**
 * Хук для дебаунсинга значения.
 * @param value Значение, которое нужно дебаунсить.
 * @param delay Задержка в миллисекундах.
 * @returns Дебаунсенное значение.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const versionRef = useRef(0);

  useEffect(() => {
    const currentVersion = ++versionRef.current;

    const handler = setTimeout(() => {
      if (currentVersion === versionRef.current) {
        setDebouncedValue(value);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
