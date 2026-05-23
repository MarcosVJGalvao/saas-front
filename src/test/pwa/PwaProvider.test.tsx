import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { PwaProvider } from '@app/pwa/PwaProvider';
import { useNetworkStatus } from '@app/pwa/hooks/useNetworkStatus';
import { usePwaInstall } from '@app/pwa/hooks/usePwaInstall';
import { usePwaUpdate } from '@app/pwa/hooks/usePwaUpdate';

const updateServiceWorkerMock = vi.fn<(reloadPage?: boolean) => Promise<void>>(() =>
  Promise.resolve(),
);
let serviceWorkerRegistrationMock: ServiceWorkerRegistration | undefined;

vi.mock('@app/pwa/registerServiceWorker', () => ({
  registerServiceWorker: ({
    onNeedRefresh,
    onRegistered,
  }: {
    onNeedRefresh: () => void;
    onRegistered: (registration: ServiceWorkerRegistration | undefined) => void;
  }) => {
    Reflect.set(window, '__triggerPwaRefresh', onNeedRefresh);
    onRegistered(serviceWorkerRegistrationMock);
    return { updateServiceWorker: updateServiceWorkerMock };
  },
}));

const wrapper = ({ children }: { children: ReactNode }) => <PwaProvider>{children}</PwaProvider>;

const setNavigatorOnLine = (nextValue: boolean) => {
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    value: nextValue,
  });
};

const installMatchMediaMock = () => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
};

describe('PwaProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setNavigatorOnLine(true);
    installMatchMediaMock();
    updateServiceWorkerMock.mockClear();
    serviceWorkerRegistrationMock = undefined;
  });

  it('atualiza o status de conectividade', () => {
    const { result } = renderHook(() => useNetworkStatus(), { wrapper });

    expect(result.current.isOnline).toBe(true);

    act(() => {
      setNavigatorOnLine(false);
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);
    expect(result.current.lastConnectionChangeAt).not.toBeNull();
  });

  it('exibe atualização disponível e aplica update quando solicitado', async () => {
    const { result } = renderHook(() => usePwaUpdate(), { wrapper });
    const triggerRefresh = Reflect.get(window, '__triggerPwaRefresh');

    expect(typeof triggerRefresh).toBe('function');

    act(() => {
      if (typeof triggerRefresh === 'function') {
        triggerRefresh();
      }
    });

    expect(result.current.isUpdateAvailable).toBe(true);

    await act(async () => {
      await result.current.applyUpdate();
    });

    expect(updateServiceWorkerMock).toHaveBeenCalledWith(true);
  });

  it('expõe mensagem amigável quando a atualização falha', async () => {
    updateServiceWorkerMock.mockImplementationOnce(() => Promise.reject(new Error('falhou')));

    const { result } = renderHook(() => usePwaUpdate(), { wrapper });
    const triggerRefresh = Reflect.get(window, '__triggerPwaRefresh');

    act(() => {
      if (typeof triggerRefresh === 'function') {
        triggerRefresh();
      }
    });

    await act(async () => {
      await result.current.applyUpdate();
    });

    expect(result.current.updateErrorMessage).toBe(
      'Não foi possível aplicar a atualização agora. Tente novamente em alguns instantes.',
    );
  });

  it('captura evento de instalação quando disponível', () => {
    const { result } = renderHook(() => usePwaInstall(), { wrapper });
    const installEvent = new Event('beforeinstallprompt');

    Object.defineProperty(installEvent, 'prompt', {
      configurable: true,
      value: () => Promise.resolve(),
    });
    Object.defineProperty(installEvent, 'userChoice', {
      configurable: true,
      value: Promise.resolve({ outcome: 'dismissed', platform: 'web' }),
    });
    Object.defineProperty(installEvent, 'preventDefault', {
      configurable: true,
      value: vi.fn(),
    });

    act(() => {
      window.dispatchEvent(installEvent);
    });

    expect(result.current.isInstallAvailable).toBe(true);
  });
});
