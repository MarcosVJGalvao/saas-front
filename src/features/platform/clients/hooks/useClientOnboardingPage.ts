import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientsService } from '@features/platform/clients/services/service';
import { useClientOnboardingForm } from '@features/platform/clients/hooks/useClientOnboardingForm';
import type { ClientOnboardingSummaryData } from '@features/platform/clients/types/clientOnboarding';

const onboardingSteps = [
  'Dados do Cliente',
  'Configuração do Tenant',
  'Plano e Assinatura',
  'Usuário Administrador',
];

export const useClientOnboardingPage = () => {
  const navigate = useNavigate();
  const onboardingForm = useClientOnboardingForm();
  const [committedSummary, setCommittedSummary] = useState<ClientOnboardingSummaryData>(
    onboardingForm.summary,
  );
  const [maxCompletedStep, setMaxCompletedStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const summaryRef = useRef(onboardingForm.summary);

  useEffect(() => {
    summaryRef.current = onboardingForm.summary;
  }, [onboardingForm.summary]);

  const isLastStep = onboardingForm.activeStep === onboardingSteps.length - 1;

  const finishOnboarding = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const onboardingResponse = await clientsService.onboard(onboardingForm.onboardingPayload);
      void navigate(`/platform/clients/${onboardingResponse.client.id}`);
    } catch {
      setErrorMessage('Não foi possível finalizar o onboarding do cliente.');
    } finally {
      setLoading(false);
    }
  }, [navigate, onboardingForm.onboardingPayload]);

  const handleNext = useCallback(() => {
    setCommittedSummary(summaryRef.current);
    if (isLastStep) {
      void finishOnboarding();
      return;
    }
    onboardingForm.setActiveStep((currentStepIndex) => {
      const nextStepIndex = Math.min(onboardingSteps.length - 1, currentStepIndex + 1);
      setMaxCompletedStep((currentMaxCompletedStep) =>
        Math.max(currentMaxCompletedStep, nextStepIndex),
      );
      return nextStepIndex;
    });
  }, [finishOnboarding, isLastStep, onboardingForm]);

  return {
    steps: onboardingSteps,
    activeStep: onboardingForm.activeStep,
    isLastStep,
    committedSummary,
    maxCompletedStep,
    loading,
    errorMessage,
    form: {
      value: onboardingForm.value,
      uiExtras: onboardingForm.uiExtras,
      actions: onboardingForm.actions,
      addressLoading: onboardingForm.addressLoading,
      planOptions: onboardingForm.planOptions,
      plansLoading: onboardingForm.plansLoading,
    },
    handleNext,
    onCancel: () => {
      void navigate('/platform/clients');
    },
    onBack: () =>
      onboardingForm.setActiveStep((currentStepIndex) => Math.max(0, currentStepIndex - 1)),
    onStepSelect: (stepIndex: number) => {
      setCommittedSummary(summaryRef.current);
      onboardingForm.setActiveStep(stepIndex);
    },
    nextDisabled:
      (onboardingForm.activeStep === 0 && !onboardingForm.isClientDataStepComplete) ||
      (onboardingForm.activeStep === 2 && onboardingForm.value.planId.length === 0) ||
      (loading && isLastStep),
  };
};
