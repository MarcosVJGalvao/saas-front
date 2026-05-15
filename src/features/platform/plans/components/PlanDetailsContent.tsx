import { AppCard } from '@shared/components/data-display/AppCard';
import { InfoList } from '@shared/components/data-display/InfoList';
import type { Plan } from '@features/platform/plans/types/plans';

const billingCycleLabel: Record<Plan['billingCycle'], string> = {
  monthly: 'Mensal',
  yearly: 'Anual',
};

export const PlanDetailsContent = ({ data }: { data: Plan }) => {
  const statusLabel = data.isActive ? 'Ativo' : 'Inativo';
  return (
    <AppCard>
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
    </AppCard>
  );
};
