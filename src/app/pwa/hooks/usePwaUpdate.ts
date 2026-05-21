import { usePwa } from '@app/pwa/usePwa';

export const usePwaUpdate = () => {
  const { applyUpdate, isUpdateAvailable, isUpdating } = usePwa();

  return {
    applyUpdate,
    isUpdateAvailable,
    isUpdating,
  };
};
