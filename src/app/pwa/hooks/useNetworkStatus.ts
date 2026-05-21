import { usePwa } from '@app/pwa/usePwa';

export const useNetworkStatus = () => {
  const { isOnline, lastConnectionChangeAt } = usePwa();

  return {
    isOnline,
    lastConnectionChangeAt,
  };
};
