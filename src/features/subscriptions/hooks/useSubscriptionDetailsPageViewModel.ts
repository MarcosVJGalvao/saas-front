import { useParams, useSearchParams } from 'react-router-dom';
import { useSubscriptionDetails } from '@features/subscriptions/hooks/useSubscriptionDetails';
import { subscriptionStatusLabelByValue } from '@shared/i18n/pt-BR/enums';

type DetailsViewState = 'loading' | 'error' | 'empty' | 'ready';

const resolveDetailsViewState = (
  loading: boolean,
  hasError: boolean,
  hasData: boolean,
): DetailsViewState => {
  if (loading) return 'loading';
  if (hasError) return 'error';
  if (!hasData) return 'empty';
  return 'ready';
};

export const useSubscriptionDetailsPageViewModel = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tenantId = searchParams.get('tenantId') ?? undefined;
  const { data, loading, errorMessage, refresh } = useSubscriptionDetails(id, tenantId);
  const viewState = resolveDetailsViewState(loading, Boolean(errorMessage), data !== null);

  return {
    data,
    loading,
    errorMessage,
    refresh,
    viewState,
    emptyMessage: 'Nenhuma assinatura encontrada.',
    sections:
      data === null
        ? []
        : [
            {
              key: 'subscription',
              title: 'Assinatura',
              items: [
                { label: 'ID', value: data.id },
                { label: 'Status', value: subscriptionStatusLabelByValue[data.status] },
                { label: 'Início', value: data.startDate },
                { label: 'Renovação', value: data.renewalDate ?? '-' },
                { label: 'Trial até', value: data.trialEndsAt ?? '-' },
                { label: 'Preço contratado', value: data.priceAtSubscription },
              ],
            },
            {
              key: 'tenant',
              title: 'Tenant',
              items: [
                { label: 'ID', value: data.tenantId },
                { label: 'Nome', value: data.tenantId },
              ],
            },
            {
              key: 'plan',
              title: 'Plano',
              items: [
                { label: 'ID', value: data.planId },
                { label: 'Nome', value: data.planId },
              ],
            },
          ],
  };
};
