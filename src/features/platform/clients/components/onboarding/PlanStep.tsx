import { AppMenuItem } from '@shared/components/inputs/AppMenuItem';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import type { Plan } from '@features/platform/plans/types/plans';
import type { OnboardingStepProps } from '@features/platform/clients/components/onboarding/types';
import { OnboardingField } from '@features/platform/clients/components/onboarding/OnboardingField';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import { translateBillingCycle } from '@shared/i18n/pt-BR/enums';

interface PlanStepProps extends OnboardingStepProps {
  planOptions: Plan[];
  plansLoading: boolean;
}

const buildPlanOptionLabel = (plan: Plan): string =>
  `${plan.name} - ${formatCurrency(plan.price, plan.currency)} - ${translateBillingCycle(plan.billingCycle)}`;

export const PlanStep = ({ value, actions, planOptions, plansLoading }: PlanStepProps) => (
  <AppStack spacing={1.5}>
    <AppText variant="h6">Plano e Assinatura</AppText>
    <OnboardingField
      select
      label="Plano"
      value={value.planId}
      onChange={actions.updatePlanId}
      helperText={plansLoading ? 'Carregando planos...' : 'Selecione o plano para a assinatura'}
      gridSize={{ xs: 12 }}
    >
      <AppMenuItem value="">Selecione</AppMenuItem>
      {planOptions.map((plan) => (
        <AppMenuItem key={plan.id} value={plan.id}>
          {buildPlanOptionLabel(plan)}
        </AppMenuItem>
      ))}
    </OnboardingField>
  </AppStack>
);
