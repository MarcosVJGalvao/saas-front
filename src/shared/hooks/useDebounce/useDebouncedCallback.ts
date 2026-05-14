import { useEffect, useMemo, useRef } from 'react';

export const useDebouncedCallback = <TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delayInMilliseconds: number,
) => {
  const timeoutReference = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutReference.current !== null) {
        window.clearTimeout(timeoutReference.current);
      }
    };
  }, []);

  return useMemo(
    () =>
      (...args: TArgs) => {
        if (timeoutReference.current !== null) {
          window.clearTimeout(timeoutReference.current);
        }
        timeoutReference.current = window.setTimeout(() => {
          callback(...args);
        }, delayInMilliseconds);
      },
    [callback, delayInMilliseconds],
  );
};
