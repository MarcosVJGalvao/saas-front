import { usePwa } from '@app/pwa/usePwa';

export const usePwaUpdate = () => {
  const { applyUpdate, isUpdateAvailable, isUpdating, updateErrorMessage } = usePwa();

  return {
    applyUpdate,
    isUpdateAvailable,
    isUpdating,
    updateErrorMessage,
  };
};
