import type { OnboardingStepData } from '@features/platform/clients/types/clientOnboarding';
import type { Plan } from '@features/platform/plans/types/plans';

export type OnboardingStepProps = OnboardingStepData;

export type OnboardingStepsProps = OnboardingStepData & {
  activeStep: number;
  planOptions: Plan[];
  plansLoading: boolean;
};
