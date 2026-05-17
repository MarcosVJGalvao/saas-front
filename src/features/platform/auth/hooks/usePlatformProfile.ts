import { useCallback, useEffect, useRef, useState } from 'react';
import { platformAuthService } from '@features/platform/auth/services/service';
import type { PlatformMeResponse } from '@features/platform/auth/services/types';

export interface UsePlatformProfileParams {
  enabled: boolean;
}

export interface UsePlatformProfileState {
  loading: boolean;
  errorMessage: string;
  profile: PlatformMeResponse | null;
  refetch: () => Promise<void>;
}

export interface PlatformProfileMessages {
  loadError: string;
}

export const PLATFORM_PROFILE_MESSAGES: PlatformProfileMessages = {
  loadError: 'Não foi possível carregar os dados do usuário da plataforma.',
};

const normalizeStatus = (status: string): string =>
  status.toUpperCase() === 'ACTIVE' ? 'Ativo' : 'Inativo';

const normalizeProfile = (profile: PlatformMeResponse): PlatformMeResponse => ({
  ...profile,
  status: normalizeStatus(profile.status),
});

export const usePlatformProfile = ({
  enabled,
}: UsePlatformProfileParams): UsePlatformProfileState => {
  const [loading, setLoading] = useState(enabled);
  const [errorMessage, setErrorMessage] = useState('');
  const [profile, setProfile] = useState<PlatformMeResponse | null>(null);
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
      const me = await platformAuthService.me();
      setProfile(normalizeProfile(me));
    } catch {
      setProfile(null);
      setErrorMessage(PLATFORM_PROFILE_MESSAGES.loadError);
    } finally {
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
