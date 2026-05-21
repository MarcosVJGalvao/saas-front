import { useEffect, useState } from 'react';
import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import { clientsService } from '@features/platform/clients/services/service';
import { plansService } from '@features/platform/plans/services/service';

const REFERENCE_LIMIT = 100;

export const usePlatformSubscriptionReferenceOptions = () => {
  const [tenantOptions, setTenantOptions] = useState<AppSelectOption[]>([]);
  const [planOptions, setPlanOptions] = useState<AppSelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    let isMounted = true;

    const loadOptions = async (): Promise<void> => {
      setLoading(true);
      setErrorMessage(undefined);

      try {
        const [clientsResponse, plansResponse] = await Promise.all([
          clientsService.list({ page: 1, limit: REFERENCE_LIMIT }),
          plansService.list({ page: 1, limit: REFERENCE_LIMIT }),
        ]);

        if (!isMounted) {
          return;
        }

        setTenantOptions(
          clientsResponse.data.map((client) => ({
            value: client.id,
            label: client.tradeName,
          })),
        );
        setPlanOptions(
          plansResponse.data
            .filter((plan) => plan.isActive)
            .map((plan) => ({
              value: plan.id,
              label: plan.name,
            })),
        );
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage('Não foi possível carregar os tenants e planos disponíveis.');
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
    tenantOptions,
    planOptions,
    loading,
    errorMessage,
  };
};
