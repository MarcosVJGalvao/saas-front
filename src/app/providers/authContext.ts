import { createContext } from 'react';
import type { PlatformTotpSetupResponse } from '@features/platform-auth/services/types';
import type { AuthDomain, AuthFlowStep } from '@models/auth/auth';
import type { AuthSession } from '@shared/types/authSession';

export interface AuthContextValue {
  authDomain: AuthDomain | null;
  flowStep: AuthFlowStep;
  challengeToken: string | null;
  totpSetup: PlatformTotpSetupResponse | null;
  session: AuthSession | null;
  startMfaChallenge: (
    domain: AuthDomain,
    challengeToken: string,
    requiresSetup: boolean,
    rememberMe?: boolean,
  ) => void;
  setTotpSetup: (setup: PlatformTotpSetupResponse | null) => void;
  completeAuthentication: (domain: AuthDomain, session: AuthSession, rememberMe?: boolean) => void;
  updateClientSessionFromRefresh: (session: AuthSession) => void;
  clearAuth: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
