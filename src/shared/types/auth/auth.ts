export type AuthDomain = 'platform' | 'client';

export const AUTH_DOMAIN: Record<'PLATFORM' | 'CLIENT', AuthDomain> = {
  PLATFORM: 'platform',
  CLIENT: 'client',
};

export type AuthFlowStep = 'idle' | 'mfa_required' | 'mfa_setup_required' | 'authenticated';

export const AUTH_FLOW_STEP: Record<
  'IDLE' | 'MFA_REQUIRED' | 'MFA_SETUP_REQUIRED' | 'AUTHENTICATED',
  AuthFlowStep
> = {
  IDLE: 'idle',
  MFA_REQUIRED: 'mfa_required',
  MFA_SETUP_REQUIRED: 'mfa_setup_required',
  AUTHENTICATED: 'authenticated',
};
