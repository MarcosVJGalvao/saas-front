import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { InfoList } from '../../../components/common/display/InfoList';
import { CircularLoader } from '../../../components/common/loading/CircularLoader';
import { ErrorState } from '../../../components/common/state/ErrorState';
import { usePlanDetails } from '../../../hooks/plans/usePlanDetails';
import type { Plan } from '../../../models/plans';

const billingCycleLabel: Record<Plan['billingCycle'], string> = {
  monthly: 'Mensal',
  yearly: 'Anual',
};
const emptyPlan: Plan = {
  id: '',
  name: '-',
  description: '-',
  price: '0.00',
  currency: 'BRL',
  billingCycle: 'monthly',
  trialDays: 0,
  isActive: false,
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
};

const PlanDetailsContent = ({ data }: { data: Plan }) => {
  const statusLabel = data.isActive ? 'Ativo' : 'Inativo';
  return (
    <Card>
      <CardContent>
        <InfoList
          items={[
            { label: 'Nome', value: data.name },
            { label: 'Descrição', value: data.description ?? '-' },
            { label: 'Preço', value: `${data.price} ${data.currency}` },
            { label: 'Ciclo', value: billingCycleLabel[data.billingCycle] },
            { label: 'Trial', value: `${data.trialDays} dias` },
            { label: 'Status', value: statusLabel },
            { label: 'Criado em', value: new Date(data.createdAt).toLocaleDateString('pt-BR') },
          ]}
        />
      </CardContent>
    </Card>
  );
};

const resolvePlanDetailsViewState = (
  loading: boolean,
  errorMessage: string | undefined,
): 'loading' | 'error' | 'ready' => {
  if (loading) return 'loading';
  if (errorMessage) return 'error';
  return 'ready';
};

const PlanDetailsPage = () => {
  const { id } = useParams();
  const { data, loading, errorMessage, refresh } = usePlanDetails(id);
  const planData = data ?? emptyPlan;
  const viewState = resolvePlanDetailsViewState(loading, errorMessage);

  const viewByState = {
    loading: <CircularLoader ariaLabel="Carregando detalhes do plano" />,
    error: (
      <ErrorState
        message={errorMessage ?? 'Erro ao carregar plano.'}
        onRetry={() => void refresh()}
      />
    ),
    ready: (
      <Stack spacing={2}>
        <Typography variant="h4">Detalhes do Plano</Typography>
        <PlanDetailsContent data={planData} />
      </Stack>
    ),
  };

  return viewByState[viewState];
};

export default PlanDetailsPage;
