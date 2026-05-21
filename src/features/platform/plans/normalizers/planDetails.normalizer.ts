import { formatIsoDate } from '@shared/formatters';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import {
  translateBillingCycle,
  translateActiveInactiveStatusFemale,
} from '@shared/i18n/pt-BR/enums';
import type { Plan } from '@features/platform/plans/types/plans';

export const toPlanDetailsItems = (plan: Plan) => ({
  general: [
    { keyLabel: 'Nome', value: plan.name },
    { keyLabel: 'Descrição', value: plan.description ?? '-' },
    { keyLabel: 'Preço', value: formatCurrency(plan.price, plan.currency) },
    { keyLabel: 'Moeda', value: plan.currency },
    { keyLabel: 'Ciclo de cobrança', value: translateBillingCycle(plan.billingCycle) },
    { keyLabel: 'Trial', value: `${plan.trialDays} dias` },
    {
      keyLabel: 'Status',
      value: translateActiveInactiveStatusFemale(plan.isActive ? 'active' : 'inactive'),
    },
  ],
  control: [
    { keyLabel: 'Criado em', value: formatIsoDate(plan.createdAt) },
    { keyLabel: 'Atualizado em', value: formatIsoDate(plan.updatedAt) },
  ],
});
