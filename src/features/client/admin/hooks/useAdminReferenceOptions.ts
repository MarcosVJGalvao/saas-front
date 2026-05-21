import { useEffect, useState } from 'react';
import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import { clientRolesService } from '@features/client/admin/services/service';
import type { ClientRole } from '@features/client/admin/types/admin.types';

const REFERENCE_LIMIT = 100;

const toRoleOption = (role: ClientRole): AppSelectOption => ({
  value: role.id,
  label: role.name,
});

export const useAdminReferenceOptions = () => {
  const [roleOptions, setRoleOptions] = useState<AppSelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    let isMounted = true;

    const loadOptions = async (): Promise<void> => {
      setLoading(true);
      setErrorMessage(undefined);

      try {
        const response = await clientRolesService.list({ page: 1, limit: REFERENCE_LIMIT });

        if (!isMounted) {
          return;
        }

        setRoleOptions(response.data.map(toRoleOption));
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage('Não foi possível carregar os perfis disponíveis.');
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
    roleOptions,
    loading,
    errorMessage,
  };
};
