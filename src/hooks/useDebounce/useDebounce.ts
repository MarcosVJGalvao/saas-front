import { useEffect, useState } from 'react';

export const useDebounce = <TValue>(value: TValue, delayInMilliseconds: number): TValue => {
  const [debouncedValue, setDebouncedValue] = useState<TValue>(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayInMilliseconds);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value, delayInMilliseconds]);

  return debouncedValue;
};
