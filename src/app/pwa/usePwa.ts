import { useContext } from 'react';
import { PwaContext, type PwaContextValue } from '@app/pwa/pwaContext';

export const usePwa = (): PwaContextValue => {
  const context = useContext(PwaContext);
  if (context === undefined) {
    throw new Error('usePwa deve ser usado dentro de PwaProvider.');
  }
  return context;
};
