import { AppMenuItem } from '@shared/components/inputs/AppMenuItem';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppText } from '@shared/components/data-display/AppText';
import type { Plan } from '@features/plans/types/plans';
import type { OnboardingStepProps } from '@features/clients/components/onboarding/types';

interface PlanStepProps extends OnboardingStepProps {
  planOptions: Plan[];
  plansLoading: boolean;
}

const translateBillingCycle = (value: Plan['billingCycle']): string =>
  value === 'monthly' ? 'Mensal' : 'Anual';

const formatCurrency = (value: string, currency: string): string => {
  const normalized = Number(value);
  if (Number.isNaN(normalized)) return `${value} ${currency}`;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(normalized);
};

const buildPlanOptionLabel = (plan: Plan): string =>
  `${plan.name} - ${formatCurrency(plan.price, plan.currency)} - ${translateBillingCycle(plan.billingCycle)}`;

export const PlanStep = ({ value, setValue, planOptions, plansLoading }: PlanStepProps) => (
  <AppStack spacing={1.5}>
    <AppText variant="h6">Plano e Assinatura</AppText>
    <AppTextField
      fullWidth
      select
      label="Plano"
      value={value.planId}
      onChange={(event) => setValue({ ...value, planId: event.target.value })}
      helperText={plansLoading ? 'Carregando planos...' : 'Selecione o plano para a assinatura'}
    >
      <AppMenuItem value="">Selecione</AppMenuItem>
      {planOptions.map((plan) => (
        <AppMenuItem key={plan.id} value={plan.id}>
          {buildPlanOptionLabel(plan)}
        </AppMenuItem>
      ))}
    </AppTextField>
  </AppStack>
);
