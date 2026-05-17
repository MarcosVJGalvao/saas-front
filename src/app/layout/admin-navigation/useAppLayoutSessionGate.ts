import { useState } from 'react';
import { useAuth } from '@shared/hooks/useAuth/useAuth';
import { useClientLogout } from '@features/client/auth/hooks/useClientLogout';

const resolveLoginPathByCurrentLocation = (pathname: string): string =>
  pathname.startsWith('/client') ? '/client/login' : '/platform/login';

const shouldBlockLayoutUntilProfileLoad = (params: {
  authDomain: string | null;
  session: unknown;
  platformProfile: unknown;
  platformProfileError: string;
  clientProfile: unknown;
  clientProfileError: string;
}): boolean => {
  const {
    authDomain,
    session,
    platformProfile,
    platformProfileError,
    clientProfile,
    clientProfileError,
  } = params;

  if (session === null) {
    return false;
  }
  if (authDomain === 'platform') {
    return platformProfile === null && platformProfileError.length === 0;
  }
  if (authDomain === 'client') {
    return clientProfile === null && clientProfileError.length === 0;
  }
  return false;
};

const resolveBlockingLabel = (
  isLoggingOut: boolean,
  shouldBlockAuthenticatedLayout: boolean,
): string | null => {
  if (isLoggingOut) {
    return 'Saindo da conta';
  }
  if (shouldBlockAuthenticatedLayout) {
    return 'Carregando sessão';
  }
  return null;
};

interface UseAppLayoutSessionGateParams {
  pathname: string;
  platformProfile: unknown;
  platformProfileError: string;
  clientProfile: unknown;
  clientProfileError: string;
  closeProfileMenu: () => void;
}

export const useAppLayoutSessionGate = ({
  pathname,
  platformProfile,
  platformProfileError,
  clientProfile,
  clientProfileError,
  closeProfileMenu,
}: UseAppLayoutSessionGateParams) => {
  const { authDomain, session, clearAuth } = useAuth();
  const { logout: logoutClientSession } = useClientLogout();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const shouldBlockAuthenticatedLayout = shouldBlockLayoutUntilProfileLoad({
    authDomain,
    session,
    platformProfile,
    platformProfileError,
    clientProfile,
    clientProfileError,
  });
  const blockingLabel = resolveBlockingLabel(isLoggingOut, shouldBlockAuthenticatedLayout);

  const handleLogout = () => {
    closeProfileMenu();
    setIsLoggingOut(true);
    const loginPath = resolveLoginPathByCurrentLocation(pathname);
    void (async () => {
      if (authDomain === 'client' && session !== null && session.sessionId.length > 0) {
        try {
          await logoutClientSession(session.sessionId);
        } catch {
          // Local logout must still happen even if server logout fails.
        }
      }
      clearAuth();
      window.location.assign(loginPath);
    })();
  };

  return {
    blockingLabel,
    handleLogout,
    authDomain,
    session,
    clearAuth,
  };
};
