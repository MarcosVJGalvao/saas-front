import { useCallback, useEffect, useRef, useState } from 'react';
import { clientAuthService } from '@features/client-auth/services/service';
import type { ClientMeResponse } from '@features/client-auth/services/types';

export interface UseClientProfileParams {
  enabled: boolean;
}

export interface UseClientProfileState {
  loading: boolean;
  errorMessage: string;
  profile: ClientMeResponse | null;
  refetch: () => Promise<void>;
}

export const CLIENT_PROFILE_MESSAGES = {
  loadError: 'Não foi possível carregar os dados do usuário.',
};

let inFlightClientProfileRequest: Promise<ClientMeResponse> | null = null;

const normalizeStatus = (status: string): string =>
  status.toUpperCase() === 'ACTIVE' ? 'Ativo' : 'Inativo';

const normalizeProfile = (profile: ClientMeResponse): ClientMeResponse => ({
  ...profile,
  status: normalizeStatus(profile.status),
  permissions: profile.permissions.map((permission) => {
    if (permission === '*:*') {
      return 'client:*';
    }
    if (permission.startsWith('client:')) {
      return permission;
    }
    return `client:${permission}`;
  }),
});

export const useClientProfile = ({ enabled }: UseClientProfileParams): UseClientProfileState => {
  const [loading, setLoading] = useState(enabled);
  const [errorMessage, setErrorMessage] = useState('');
  const [profile, setProfile] = useState<ClientMeResponse | null>(null);
  const hasRequestedProfileRef = useRef(false);

  const fetchProfile = useCallback(async () => {
    if (!enabled) {
      setProfile(null);
      setErrorMessage('');
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const request = inFlightClientProfileRequest ?? clientAuthService.me();
      inFlightClientProfileRequest = request;
      const me = await request;
      setProfile(normalizeProfile(me));
    } catch {
      setProfile(null);
      setErrorMessage(CLIENT_PROFILE_MESSAGES.loadError);
    } finally {
      inFlightClientProfileRequest = null;
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled && hasRequestedProfileRef.current) {
      return;
    }
    if (!enabled) {
      hasRequestedProfileRef.current = false;
    } else {
      hasRequestedProfileRef.current = true;
    }
    void fetchProfile();
  }, [enabled, fetchProfile]);

  return { loading, errorMessage, profile, refetch: fetchProfile };
};
