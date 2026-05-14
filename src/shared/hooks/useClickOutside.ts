import { useEffect } from 'react';

export const useClickOutside = <T extends HTMLElement>(
  element: T | null,
  onClickOutside: () => void,
  isEnabled = true,
) => {
  useEffect(() => {
    if (!isEnabled || element === null) {
      return undefined;
    }

    const listener = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (!element.contains(target)) {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [element, isEnabled, onClickOutside]);
};
