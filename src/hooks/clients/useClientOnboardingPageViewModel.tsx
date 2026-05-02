import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminStep } from '../../components/common/onboarding/AdminStep';
import { ClientDataStep } from '../../components/common/onboarding/ClientDataStep';
import { PlanStep } from '../../components/common/onboarding/PlanStep';
import { TenantStep } from '../../components/common/onboarding/TenantStep';
import { useClientOnboardingForm } from './useClientOnboardingForm';
import { useClientsMutations } from './useClientsMutations';
import type { OnboardingSummaryData } from '../../components/common/onboarding/types';

interface ClientOnboardingPageViewModel {
  steps: string[];
  activeStep: number;
  isLastStep: boolean;
  stepContent: ReactNode;
  committedSummary: OnboardingSummaryData;
  maxCompletedStep: number;
  loading: boolean;
  value: { planId: string };
  handleNext: () => void;
  onCancel: () => void;
  onBack: () => void;
  onStepSelect: (stepIndex: number) => void;
  nextDisabled: boolean;
}

const steps = [
  'Dados do Cliente',
  'Configuração do Tenant',
  'Plano e Assinatura',
  'Usuário Administrador',
];

export const useClientOnboardingPageViewModel = (): ClientOnboardingPageViewModel => {
  const mutations = useClientsMutations();
  const navigate = useNavigate();
  const {
    activeStep,
    setActiveStep,
    value,
    setValue,
    uiExtras,
    setUiExtras,
    summary,
    onboardingPayload,
    isClientDataStepComplete,
    planOptions,
    plansLoading,
  } = useClientOnboardingForm();
  const [committedSummary, setCommittedSummary] = useState(summary);
  const [maxCompletedStep, setMaxCompletedStep] = useState(0);
  const summaryRef = useRef(summary);
  useEffect(() => {
    summaryRef.current = summary;
  }, [summary]);
  const isLastStep = activeStep === steps.length - 1;
  const loading = Boolean(mutations.loading);

  const handleNext = useCallback(() => {
    setCommittedSummary(summaryRef.current);
    if (isLastStep) {
      void mutations.onboard(onboardingPayload);
      return;
    }
    setActiveStep((stepIndex) => {
      const nextStepIndex = Math.min(steps.length - 1, stepIndex + 1);
      setMaxCompletedStep((previousMaxCompletedStep) =>
        Math.max(previousMaxCompletedStep, nextStepIndex),
      );
      return nextStepIndex;
    });
  }, [isLastStep, mutations, onboardingPayload, setActiveStep]);

  const stepContent = useMemo(() => {
    const sharedProps = { value, setValue, uiExtras, setUiExtras };
    const stepComponents = [
      <ClientDataStep key="client-data" {...sharedProps} />,
      <TenantStep key="tenant" {...sharedProps} />,
      <PlanStep
        key="plan"
        {...sharedProps}
        planOptions={planOptions}
        plansLoading={plansLoading}
      />,
      <AdminStep key="admin" {...sharedProps} />,
    ];
    return stepComponents[activeStep] ?? stepComponents[0];
  }, [activeStep, planOptions, plansLoading, setUiExtras, setValue, uiExtras, value]);

  return {
    steps,
    activeStep,
    isLastStep,
    stepContent,
    committedSummary,
    maxCompletedStep,
    loading,
    value,
    handleNext,
    onCancel: () => void navigate('/platform/clients'),
    onBack: () => setActiveStep((stepIndex) => Math.max(0, stepIndex - 1)),
    onStepSelect: (stepIndex: number) => {
      setCommittedSummary(summaryRef.current);
      setActiveStep(stepIndex);
    },
    nextDisabled:
      (activeStep === 0 && !isClientDataStepComplete) ||
      (activeStep === 2 && value.planId.length === 0) ||
      (loading && isLastStep),
  };
};
