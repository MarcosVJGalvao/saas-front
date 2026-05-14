import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useClientOnboardingForm,
  type UseClientOnboardingFormResult,
} from '@features/clients/hooks/useClientOnboardingForm';
import { useClientsMutations } from '@features/clients/hooks/useClientsMutations';
import type { OnboardingSummaryData } from '@features/clients/components/onboarding/types';

interface ClientOnboardingPageViewModel {
  steps: string[];
  activeStep: number;
  isLastStep: boolean;
  committedSummary: OnboardingSummaryData;
  maxCompletedStep: number;
  loading: boolean;
  form: Pick<
    UseClientOnboardingFormResult,
    'value' | 'setValue' | 'uiExtras' | 'setUiExtras' | 'planOptions' | 'plansLoading'
  >;
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

  return {
    steps,
    activeStep,
    isLastStep,
    committedSummary,
    maxCompletedStep,
    loading,
    form: { value, setValue, uiExtras, setUiExtras, planOptions, plansLoading },
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
