import type { AuthDomain } from '@shared/types/auth/auth';

export const resolveProfilePathByDomain = (domain: AuthDomain): string =>
  domain === 'client' ? '/client/me' : '/platform/me';
