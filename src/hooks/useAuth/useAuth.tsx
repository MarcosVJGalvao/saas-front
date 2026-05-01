import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { AUTH_FLOW_STEP, type AuthDomain, type AuthFlowStep } from '../../models/auth/auth';
import type { PlatformTotpSetupResponse } from '../../services/platform/auth/types';
import {
  clearClientSessionStorage,
  clearPlatformSessionStorage,
  hasClientPersistentSession,
  readClientSession,
  readPlatformSession,
  writeClientSession,
  writePlatformSession,
} from '../../services/client/auth/sessionStorage';
import type { AuthSession } from '../../services/client/auth/types';

interface AuthContextValue {
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

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initialClientSession = readClientSession();
  const initialPlatformSession = readPlatformSession();
  const initialSession = initialClientSession ?? initialPlatformSession;
  const initialDomain: AuthDomain | null =
    initialClientSession !== null ? 'client' : initialPlatformSession !== null ? 'platform' : null;
  const [authDomain, setAuthDomain] = useState<AuthDomain | null>(initialDomain);
  const [flowStep, setFlowStep] = useState<AuthFlowStep>(
    initialSession === null ? AUTH_FLOW_STEP.IDLE : AUTH_FLOW_STEP.AUTHENTICATED,
  );
  const [challengeToken, setChallengeToken] = useState<string | null>(null);
  const [totpSetup, setTotpSetup] = useState<PlatformTotpSetupResponse | null>(null);
  const [session, setSession] = useState<AuthSession | null>(initialSession);
  const [rememberMePreference, setRememberMePreference] = useState(false);

  const value = useMemo<AuthContextValue>(
    () => ({
      authDomain,
      flowStep,
      challengeToken,
      totpSetup,
      session,
      startMfaChallenge: (domain, nextChallengeToken, requiresSetup, rememberMe = false) => {
        setAuthDomain(domain);
        setChallengeToken(nextChallengeToken);
        setRememberMePreference(rememberMe);
        setSession(null);
        setFlowStep(
          requiresSetup ? AUTH_FLOW_STEP.MFA_SETUP_REQUIRED : AUTH_FLOW_STEP.MFA_REQUIRED,
        );
      },
      setTotpSetup: (setup) => {
        setTotpSetup(setup);
      },
      completeAuthentication: (domain, nextSession, rememberMe = rememberMePreference) => {
        setAuthDomain(domain);
        setChallengeToken(null);
        setTotpSetup(null);
        setSession(nextSession);
        if (domain === 'client') {
          writeClientSession(nextSession, rememberMe);
        } else {
          writePlatformSession(nextSession, rememberMe);
        }
        setFlowStep(AUTH_FLOW_STEP.AUTHENTICATED);
      },
      updateClientSessionFromRefresh: (nextSession) => {
        setAuthDomain('client');
        setChallengeToken(null);
        setTotpSetup(null);
        setSession(nextSession);
        writeClientSession(nextSession, hasClientPersistentSession());
        setFlowStep(AUTH_FLOW_STEP.AUTHENTICATED);
      },
      clearAuth: () => {
        setAuthDomain(null);
        setChallengeToken(null);
        setTotpSetup(null);
        setSession(null);
        setRememberMePreference(false);
        clearClientSessionStorage();
        clearPlatformSessionStorage();
        setFlowStep(AUTH_FLOW_STEP.IDLE);
      },
    }),
    [authDomain, flowStep, challengeToken, totpSetup, session, rememberMePreference],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }
  return context;
};
