import { useEffect, useRef, useState } from 'react';
import { clientAuthService } from '@features/client/auth/services/service';
import type { ClientMeResponse } from '@features/client/auth/services/types';

export interface ClientHomeMessages {
  title: string;
  success: string;
  loadError: string;
}

export const CLIENT_HOME_MESSAGES: ClientHomeMessages = {
  title: 'Home do Cliente',
  success: 'Autenticação concluída com sucesso.',
  loadError: 'Não foi possível carregar os dados do usuário.',
};

export type ClientHomeProfile = ClientMeResponse;

export const useClientHomeData = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ClientMeResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const hasRequestedProfileRef = useRef(false);

  useEffect(() => {
    if (hasRequestedProfileRef.current) {
      return;
    }
    hasRequestedProfileRef.current = true;
    void clientAuthService
      .me()
      .then((me) => {
        setProfile(me);
      })
      .catch(() => {
        setErrorMessage(CLIENT_HOME_MESSAGES.loadError);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { loading, profile, errorMessage };
};
