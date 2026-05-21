import { AppText } from '@shared/components/data-display/AppText';
import { AppStack } from '@shared/components/layout/AppStack';
import { createOptionsWithPlaceholder } from '@shared/constants/selectOptions';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import { translateBillingCycle } from '@shared/i18n/pt-BR/enums';
import { OnboardingField } from '@features/platform/clients/components/onboarding/OnboardingField';
import type { ClientOnboardingStepProps } from '@features/platform/clients/types/clientOnboarding';
import type { Plan } from '@features/platform/plans/types/plans';

interface PlanStepProps extends ClientOnboardingStepProps {
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
      options={createOptionsWithPlaceholder(
        planOptions.map((plan) => ({
          value: plan.id,
          label: buildPlanOptionLabel(plan),
        })),
      )}
    />
  </AppStack>
);
