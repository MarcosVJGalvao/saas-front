import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import {
  RowActionsMenu,
  type RowActionItem,
} from '@shared/components/data-display/data/RowActionsMenu';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import { AppText } from '@shared/components/data-display/AppText';
import { AppStack } from '@shared/components/layout/AppStack';
import type { Plan } from '@features/plans/types/plans';

interface PlansListPresentationParams {
  buildPlanActions: (row: Plan) => RowActionItem[];
}

const translateBillingCycle = (value: Plan['billingCycle']): string =>
  value === 'monthly' ? 'Mensal' : 'Anual';

const formatCurrency = (value: string, currency: string): string => {
  const normalized = Number(value);
  if (Number.isNaN(normalized)) return `${value} ${currency}`;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(normalized);
};

const formatDate = (value: string): string => new Date(value).toLocaleDateString('pt-BR');

const renderPlanStatus = (row: Plan) => (
  <LocalizedStatusBadge
    label={row.isActive ? 'Ativa' : 'Inativa'}
    tone={row.isActive ? 'active' : 'neutral'}
  />
);

const renderPlanActions = (row: Plan, buildPlanActions: (row: Plan) => RowActionItem[]) => (
  <RowActionsMenu triggerAriaLabel={`Abrir ações de ${row.name}`} actions={buildPlanActions(row)} />
);

export const buildPlansTableColumns = ({
  buildPlanActions,
}: PlansListPresentationParams): DataTableColumn<Plan>[] => [
  {
    key: 'name',
    header: 'Nome',
    width: '1fr',
    render: (row) => row.name,
  },
  {
    key: 'description',
    header: 'Descrição',
    width: '1.8fr',
    render: (row) => row.description ?? '-',
  },
  {
    key: 'price',
    header: 'Preço',
    width: '0.9fr',
    render: (row) => formatCurrency(row.price, row.currency),
  },
  {
    key: 'billingCycle',
    header: 'Ciclo',
    width: '0.8fr',
    render: (row) => translateBillingCycle(row.billingCycle),
  },
  {
    key: 'trialDays',
    header: 'Trial',
    width: '0.7fr',
    render: (row) => `${row.trialDays} dias`,
  },
  {
    key: 'status',
    header: 'Status',
    width: '96px',
    render: renderPlanStatus,
  },
  {
    key: 'createdAt',
    header: 'Criado em',
    width: '120px',
    render: (row) => formatDate(row.createdAt),
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    width: '44px',
    render: (row) => renderPlanActions(row, buildPlanActions),
  },
];

export const buildPlansMobileConfig = ({
  buildPlanActions,
}: PlansListPresentationParams): DataListMobileConfig<Plan> => ({
  renderTitle: (row) => row.name,
  renderStatus: renderPlanStatus,
  renderActions: (row) => renderPlanActions(row, buildPlanActions),
  renderDetails: (row) => (
    <AppStack spacing={1} sx={{ px: 0 }}>
      <AppStack
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          columnGap: 1.5,
          rowGap: 1,
          alignItems: 'start',
        }}
      >
        <AppStack spacing={0.5} sx={{ minWidth: 0 }}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Descrição
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {row.description ?? '-'}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5} sx={{ minWidth: 0, alignItems: 'flex-end', textAlign: 'right' }}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Preço
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {formatCurrency(row.price, row.currency)}
          </AppText>
        </AppStack>
      </AppStack>
      <AppStack
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          columnGap: 1.5,
          rowGap: 1,
          alignItems: 'start',
        }}
      >
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Ciclo
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {translateBillingCycle(row.billingCycle)}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5} sx={{ alignItems: 'flex-end', textAlign: 'right' }}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Trial
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {row.trialDays} dias
          </AppText>
        </AppStack>
      </AppStack>
      <AppStack spacing={0.5}>
        <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Criado em
        </AppText>
        <AppText variant="body2" sx={{ fontWeight: 700 }}>
          {formatDate(row.createdAt)}
        </AppText>
      </AppStack>
    </AppStack>
  ),
});
