import { AdminStep } from '@features/platform/clients/components/onboarding/AdminStep';
import { ClientDataStep } from '@features/platform/clients/components/onboarding/ClientDataStep';
import { PlanStep } from '@features/platform/clients/components/onboarding/PlanStep';
import { TenantStep } from '@features/platform/clients/components/onboarding/TenantStep';
import type { ClientOnboardingStepsProps } from '@features/platform/clients/types/clientOnboarding';

export const OnboardingSteps = ({
  activeStep,
  value,
  uiExtras,
  actions,
  addressLoading,
  planOptions,
  plansLoading,
}: ClientOnboardingStepsProps) => {
  const sharedStepProps = {
    value,
    uiExtras,
    actions,
    addressLoading,
  };
  const stepContentByIndex = [
    <ClientDataStep key="client-data" {...sharedStepProps} />,
    <TenantStep key="tenant" {...sharedStepProps} />,
    <PlanStep
      key="plan"
      {...sharedStepProps}
      planOptions={planOptions}
      plansLoading={plansLoading}
    />,
    <AdminStep key="admin" {...sharedStepProps} />,
  ];

  return stepContentByIndex[activeStep] ?? stepContentByIndex[0];
};
