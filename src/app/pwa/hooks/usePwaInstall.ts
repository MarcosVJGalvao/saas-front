import { usePwa } from '@app/pwa/usePwa';

export const usePwaInstall = () => {
  const {
    deferredPrompt,
    dismissInstallPrompt,
    installApp,
    isInstallAvailable,
    isInstalled,
    isIosInstallAvailable,
  } = usePwa();

  return {
    deferredPrompt,
    dismissInstallPrompt,
    installApp,
    isInstallAvailable,
    isInstalled,
    isIosInstallAvailable,
  };
};
