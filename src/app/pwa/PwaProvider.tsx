import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { pwaPushBridge } from '@app/pwa/push/pushSupport';
import { PwaContext, type PwaContextValue } from '@app/pwa/pwaContext';
import { registerServiceWorker } from '@app/pwa/registerServiceWorker';
import type { BeforeInstallPromptEvent } from '@app/pwa/types';
import { pwaMessages } from '@shared/i18n/pt-BR/messages';

const INSTALL_DISMISS_STORAGE_KEY = 'app:pwa-install-dismissed';

const isBrowser = () => typeof window !== 'undefined';

const getStandaloneNavigatorFlag = (): boolean => {
  if (!isBrowser()) {
    return false;
  }

  const standaloneValue: unknown = Reflect.get(window.navigator, 'standalone');
  return typeof standaloneValue === 'boolean' ? standaloneValue : false;
};

const isStandaloneDisplayMode = (): boolean => {
  if (!isBrowser()) {
    return false;
  }

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    getStandaloneNavigatorFlag()
  );
};

const isIosDevice = (): boolean => {
  if (!isBrowser()) {
    return false;
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

const isSafariBrowser = (): boolean => {
  if (!isBrowser()) {
    return false;
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  return /safari/.test(userAgent) && !/chrome|android|crios|fxios|edgios/.test(userAgent);
};

const canShowIosInstallHint = (): boolean =>
  isBrowser() && isIosDevice() && isSafariBrowser() && !isStandaloneDisplayMode();

const readInstallDismissed = (): boolean => {
  if (!isBrowser()) {
    return false;
  }

  return window.localStorage.getItem(INSTALL_DISMISS_STORAGE_KEY) === 'true';
};

const writeInstallDismissed = (): void => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(INSTALL_DISMISS_STORAGE_KEY, 'true');
};

const clearInstallDismissed = (): void => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(INSTALL_DISMISS_STORAGE_KEY);
};

const isBeforeInstallPromptEvent = (event: Event): event is BeforeInstallPromptEvent =>
  'prompt' in event && typeof event.prompt === 'function' && 'userChoice' in event;

const waitForControllerChange = (): Promise<void> =>
  new Promise((resolve) => {
    let hasResolved = false;

    const finalize = () => {
      if (hasResolved) {
        return;
      }

      hasResolved = true;
      window.removeEventListener('controllerchange', handleControllerChange);
      resolve();
    };

    const handleControllerChange = () => {
      finalize();
      window.location.reload();
    };

    window.addEventListener('controllerchange', handleControllerChange, { once: true });
    window.setTimeout(finalize, 4000);
  });

export const PwaProvider = ({ children }: { children: ReactNode }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(isStandaloneDisplayMode);
  const [installDismissed, setInstallDismissed] = useState(readInstallDismissed);
  const [isOnline, setIsOnline] = useState(() => (isBrowser() ? window.navigator.onLine : true));
  const [lastConnectionChangeAt, setLastConnectionChangeAt] = useState<number | null>(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string | null>(null);
  const updateServiceWorkerRef = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);
  const serviceWorkerRegistrationRef = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      if (!isBeforeInstallPromptEvent(event)) {
        return;
      }

      event.preventDefault();
      setDeferredPrompt(event);
      if (isStandaloneDisplayMode()) {
        setIsInstalled(true);
      } else if (!readInstallDismissed()) {
        clearInstallDismissed();
        setInstallDismissed(false);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      clearInstallDismissed();
      setInstallDismissed(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    const mediaQueryList = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => {
      setIsInstalled(isStandaloneDisplayMode());
    };

    mediaQueryList.addEventListener('change', handleDisplayModeChange);
    return () => mediaQueryList.removeEventListener('change', handleDisplayModeChange);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastConnectionChangeAt(Date.now());
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastConnectionChangeAt(Date.now());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const { updateServiceWorker } = registerServiceWorker({
      onNeedRefresh: () => {
        setIsUpdateAvailable(true);
        setUpdateErrorMessage(null);
      },
      onRegistered: (registration) => {
        serviceWorkerRegistrationRef.current = registration ?? null;
      },
    });

    updateServiceWorkerRef.current = updateServiceWorker;
  }, []);

  const value = useMemo<PwaContextValue>(
    () => ({
      deferredPrompt,
      isInstallAvailable: deferredPrompt !== null && !installDismissed && !isInstalled,
      isInstalled,
      isIosInstallAvailable: canShowIosInstallHint() && !installDismissed && !isInstalled,
      isOnline,
      isUpdateAvailable,
      isUpdating,
      updateErrorMessage,
      dismissInstallPrompt: () => {
        writeInstallDismissed();
        setInstallDismissed(true);
      },
      installApp: async () => {
        if (deferredPrompt === null) {
          return false;
        }

        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          clearInstallDismissed();
          setInstallDismissed(false);
          return true;
        }

        return false;
      },
      applyUpdate: async () => {
        if (isUpdating) {
          return;
        }

        const updateServiceWorker = updateServiceWorkerRef.current;
        setIsUpdating(true);
        setUpdateErrorMessage(null);

        try {
          if (updateServiceWorker !== null) {
            await updateServiceWorker(true);
            setIsUpdateAvailable(false);
            return;
          }

          const registration = serviceWorkerRegistrationRef.current;
          if (registration !== null) {
            await registration.update();

            const waitingServiceWorker = registration.waiting;
            if (waitingServiceWorker !== null) {
              waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
              setIsUpdateAvailable(false);
              await waitForControllerChange();
              return;
            }
          }

          setUpdateErrorMessage(pwaMessages.updateError);
        } catch {
          const registration = serviceWorkerRegistrationRef.current;
          const waitingServiceWorker = registration?.waiting ?? null;

          if (waitingServiceWorker !== null) {
            waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
            setIsUpdateAvailable(false);
            await waitForControllerChange();
            return;
          }

          setUpdateErrorMessage(pwaMessages.updateError);
        } finally {
          setIsUpdating(false);
        }
      },
      lastConnectionChangeAt,
      pushPermissionState: pwaPushBridge.permissionState,
    }),
    [
      deferredPrompt,
      installDismissed,
      isInstalled,
      isOnline,
      isUpdateAvailable,
      isUpdating,
      updateErrorMessage,
      lastConnectionChangeAt,
    ],
  );

  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>;
};
