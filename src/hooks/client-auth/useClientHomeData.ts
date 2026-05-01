import { useEffect, useState } from 'react';
import { clientAuthService } from '@/services/client/auth/service';
import type { ClientMeResponse } from '@/services/client/auth/types';

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

  useEffect(() => {
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
