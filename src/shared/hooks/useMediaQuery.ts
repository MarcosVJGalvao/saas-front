import { useEffect, useState } from 'react';

const sanitize = (query: string) => query.replace(/^@media\s?/, '');

export const useMediaQuery = (query: string): boolean => {
  const sanitizedQuery = sanitize(query);
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(sanitizedQuery).matches : false,
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQueryList = window.matchMedia(sanitizedQuery);
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener('change', listener);

    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [sanitizedQuery]);

  return matches;
};
