import { AUTH_FLOW_STEP, type AuthDomain, type AuthFlowStep } from '@models/auth/auth';
import type { AuthSession } from '@shared/types/authSession';

export const isAuthenticatedForDomain = (
  authDomain: AuthDomain | null,
  flowStep: AuthFlowStep,
  session: AuthSession | null,
  domain: AuthDomain,
) => session !== null && authDomain === domain && flowStep === AUTH_FLOW_STEP.AUTHENTICATED;
