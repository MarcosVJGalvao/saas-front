import { useEffect, useState } from 'react';
import type { AppAutocompleteOption } from '@shared/components/form/AppAutocomplete';
import { clientUsersService } from '@features/client/admin/services/service';
import type { ClientUser } from '@features/client/admin/types/admin.types';

const RECIPIENTS_LIMIT = 100;

const buildUserOptionLabel = (user: ClientUser): string => {
  const primaryLabel = user.fullName ?? user.name ?? user.email ?? user.id;
  const secondaryLabel = user.email;

  if (
    secondaryLabel === undefined ||
    secondaryLabel.length === 0 ||
    secondaryLabel === primaryLabel
  ) {
    return primaryLabel;
  }

  return `${primaryLabel} (${secondaryLabel})`;
};

const toUserOption = (user: ClientUser): AppAutocompleteOption => ({
  value: user.id,
  label: buildUserOptionLabel(user),
});

export interface UseNotificationRecipientOptionsResult {
  userOptions: AppAutocompleteOption[];
  loading: boolean;
  errorMessage: string | undefined;
}

export const useNotificationRecipientOptions = (): UseNotificationRecipientOptionsResult => {
  const [userOptions, setUserOptions] = useState<AppAutocompleteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    let isMounted = true;

    const loadOptions = async (): Promise<void> => {
      setLoading(true);
      setErrorMessage(undefined);

      try {
        const response = await clientUsersService.list({ page: 1, limit: RECIPIENTS_LIMIT });

        if (!isMounted) {
          return;
        }

        setUserOptions(response.data.map(toUserOption));
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage('Não foi possível carregar os usuários disponíveis para envio.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    userOptions,
    loading,
    errorMessage,
  };
};
