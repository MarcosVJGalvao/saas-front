import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useParams, useSearchParams } from 'react-router-dom';
import { InfoList } from '../../../components/common/display/InfoList';
import { CircularLoader } from '../../../components/common/loading/CircularLoader';
import { ErrorState } from '../../../components/common/state/ErrorState';
import { useSubscriptionDetails } from '../../../hooks/subscriptions/useSubscriptionDetails';
import { subscriptionStatusLabelByValue } from '../../../models/subscriptionStatusLabels';
import type { Subscription } from '../../../models/subscriptions';

type DetailsViewState = 'loading' | 'error' | 'empty' | 'ready';

const stateByKey: Record<string, DetailsViewState> = {
  'true-false-false': 'loading',
  'true-false-true': 'loading',
  'true-true-false': 'loading',
  'true-true-true': 'loading',
  'false-true-false': 'error',
  'false-true-true': 'error',
  'false-false-false': 'empty',
  'false-false-true': 'ready',
};

function resolveDetailsViewState(
  loading: boolean,
  hasError: boolean,
  hasData: boolean,
): DetailsViewState {
  const key = `${loading}-${hasError}-${hasData}`;
  return stateByKey[key] ?? 'empty';
}

function SubscriptionDetailsCards({ data }: { data: Subscription }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Detalhes da Assinatura</Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Assinatura
          </Typography>
          <InfoList
            items={[
              { label: 'ID', value: data.id },
              { label: 'Status', value: subscriptionStatusLabelByValue[data.status] },
              { label: 'Início', value: data.startDate },
              { label: 'Renovação', value: data.renewalDate ?? '-' },
              { label: 'Trial até', value: data.trialEndsAt ?? '-' },
              { label: 'Preço contratado', value: data.priceAtSubscription },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Tenant
          </Typography>
          <InfoList
            items={[
              { label: 'ID', value: data.tenantId },
              { label: 'Nome', value: data.tenantId },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Plano
          </Typography>
          <InfoList
            items={[
              { label: 'ID', value: data.planId },
              { label: 'Nome', value: data.planId },
            ]}
          />
        </CardContent>
      </Card>
    </Stack>
  );
}

const emptyState = <Typography>Nenhuma assinatura encontrada.</Typography>;

// eslint-disable-next-line complexity
const SubscriptionDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tenantId = searchParams.get('tenantId') ?? undefined;
  const { data, loading, errorMessage, refresh } = useSubscriptionDetails(id, tenantId);

  const hasData = data !== null;
  const viewState = resolveDetailsViewState(loading, Boolean(errorMessage), hasData);

  if (viewState === 'loading')
    return <CircularLoader ariaLabel="Carregando detalhes da assinatura" />;
  if (viewState === 'error') {
    return (
      <ErrorState
        message={errorMessage ?? 'Erro ao carregar assinatura.'}
        onRetry={() => void refresh()}
      />
    );
  }
  if (viewState === 'empty') return emptyState;
  return data ? <SubscriptionDetailsCards data={data} /> : emptyState;
};

export default SubscriptionDetailsPage;
