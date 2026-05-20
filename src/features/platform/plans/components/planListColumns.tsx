import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import { AppText } from '@shared/components/data-display/AppText';
import { AppStack } from '@shared/components/layout/AppStack';
import { formatIsoDate } from '@shared/formatters';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import { translateBillingCycle } from '@shared/i18n/pt-BR/enums';
import type { Plan } from '@features/platform/plans/types/plans';

export interface PlanColumnActions {
  onDetails: (plan: Plan) => void;
  onEdit: (plan: Plan) => void;
  onDelete: (plan: Plan) => void;
}

const renderStatus = (plan: Plan) => (
  <LocalizedStatusBadge
    label={plan.isActive ? 'Ativa' : 'Inativa'}
    tone={plan.isActive ? 'active' : 'neutral'}
  />
);

const renderActions = (plan: Plan, actions: PlanColumnActions) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações do plano ${plan.name}`}
    actions={[
      { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(plan) },
      { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(plan) },
      { key: 'delete', label: 'Excluir', onClick: () => actions.onDelete(plan) },
    ]}
  />
);

export const buildPlanColumns = (actions: PlanColumnActions): DataTableColumn<Plan>[] => [
  { key: 'name', header: 'Nome', render: (plan) => plan.name },
  { key: 'description', header: 'Descrição', render: (plan) => plan.description ?? '-' },
  {
    key: 'price',
    header: 'Preço',
    render: (plan) => formatCurrency(plan.price, plan.currency),
  },
  {
    key: 'billingCycle',
    header: 'Ciclo',
    render: (plan) => translateBillingCycle(plan.billingCycle),
  },
  {
    key: 'trialDays',
    header: 'Trial',
    render: (plan) => `${plan.trialDays} dias`,
  },
  { key: 'status', header: 'Status', render: renderStatus },
  { key: 'createdAt', header: 'Criado em', render: (plan) => formatIsoDate(plan.createdAt) },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (plan) => renderActions(plan, actions),
  },
];

export const buildPlanMobileConfig = (actions: PlanColumnActions): DataListMobileConfig<Plan> => ({
  renderTitle: (plan) => plan.name,
  renderSubtitle: (plan) => plan.description ?? translateBillingCycle(plan.billingCycle),
  renderStatus,
  renderActions: (plan) => renderActions(plan, actions),
  renderDetails: (plan) => (
    <AppStack spacing={1}>
      <AppStack
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          columnGap: 1.5,
          rowGap: 1,
        }}
      >
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Preço
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {formatCurrency(plan.price, plan.currency)}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5} sx={{ alignItems: 'flex-end', textAlign: 'right' }}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Trial
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {plan.trialDays} dias
          </AppText>
        </AppStack>
      </AppStack>
      <AppStack
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          columnGap: 1.5,
          rowGap: 1,
        }}
      >
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Ciclo
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {translateBillingCycle(plan.billingCycle)}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5} sx={{ alignItems: 'flex-end', textAlign: 'right' }}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Criado em
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {formatIsoDate(plan.createdAt)}
          </AppText>
        </AppStack>
      </AppStack>
    </AppStack>
  ),
});
