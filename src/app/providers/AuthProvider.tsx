import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AUTH_FLOW_STEP, type AuthDomain, type AuthFlowStep } from '@shared/types/auth/auth';
import {
  clearClientSessionStorage,
  clearPlatformSessionStorage,
  hasClientPersistentSession,
  readClientSession,
  readPlatformSession,
  writeClientSession,
  writePlatformSession,
} from '@shared/services/authSessionStorage';
import type { AuthSession } from '@shared/types/authSession';
import { AuthContext, type AuthContextValue } from '@app/providers/authContext';

const SESSION_UPDATED_EVENT = 'app:session-updated';

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
  const [totpSetup, setTotpSetup] = useState<AuthContextValue['totpSetup']>(null);
  const [session, setSession] = useState<AuthSession | null>(initialSession);
  const [rememberMePreference, setRememberMePreference] = useState(false);

  useEffect(() => {
    const handleSessionUpdated = () => {
      const nextClientSession = readClientSession();
      const nextPlatformSession = readPlatformSession();
      const nextSession = nextClientSession ?? nextPlatformSession;
      const nextDomain: AuthDomain | null =
        nextClientSession !== null ? 'client' : nextPlatformSession !== null ? 'platform' : null;
      setSession(nextSession);
      setAuthDomain(nextDomain);
      setFlowStep(nextSession === null ? AUTH_FLOW_STEP.IDLE : AUTH_FLOW_STEP.AUTHENTICATED);
    };

    window.addEventListener(SESSION_UPDATED_EVENT, handleSessionUpdated);
    return () => window.removeEventListener(SESSION_UPDATED_EVENT, handleSessionUpdated);
  }, []);

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
