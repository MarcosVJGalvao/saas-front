import { registerSW } from 'virtual:pwa-register';

interface RegisterServiceWorkerParams {
  onNeedRefresh: () => void;
  onRegistered: (registration: ServiceWorkerRegistration | undefined) => void;
}

export interface RegisteredServiceWorkerController {
  updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
}

export const registerServiceWorker = ({
  onNeedRefresh,
  onRegistered,
}: RegisterServiceWorkerParams): RegisteredServiceWorkerController => {
  const updateServiceWorker = registerSW({
    immediate: true,
    onNeedRefresh,
    onRegisteredSW: (_serviceWorkerUrl, registration) => {
      onRegistered(registration);
    },
  });

  return { updateServiceWorker };
};
