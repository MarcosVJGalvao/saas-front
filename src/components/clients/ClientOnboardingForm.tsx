import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useClientOnboardingForm } from '../../hooks/clients/useClientOnboardingForm';
import type { CreateClientOnboardingRequest } from '../../models/clients';
import { layoutSpacing } from '../../theme/spacing';
import { toOnboardingPayload } from '../../utils/clientOnboarding';
import { StepperWizard } from '../common/navigation/StepperWizard';
import { AdminStep } from './onboarding/AdminStep';
import { ClientDataStep } from './onboarding/ClientDataStep';
import { OnboardingSummary } from './onboarding/OnboardingSummary';
import { PlanStep } from './onboarding/PlanStep';
import { TenantStep } from './onboarding/TenantStep';

const steps = [
  'Dados do Cliente',
  'Configuração do Tenant',
  'Plano e Assinatura',
  'Usuário Administrador',
];

interface Props {
  loading: boolean;
  onSubmit: (value: CreateClientOnboardingRequest) => void;
  onCancel: () => void;
}

export const ClientOnboardingForm = ({ loading, onSubmit, onCancel }: Props) => {
  const {
    activeStep,
    setActiveStep,
    value,
    setValue,
    uiExtras,
    setUiExtras,
    summary,
    isClientDataStepComplete,
  } = useClientOnboardingForm();
  const [committedSummary, setCommittedSummary] = useState(summary);
  const [maxCompletedStep, setMaxCompletedStep] = useState(0);
  const summaryRef = useRef(summary);
  const isLastStep = activeStep === steps.length - 1;
  const submitPayload = useMemo<CreateClientOnboardingRequest>(
    () => toOnboardingPayload(value, uiExtras),
    [uiExtras, value],
  );

  useEffect(() => {
    summaryRef.current = summary;
  }, [summary]);

  const handleNext = useCallback(() => {
    setCommittedSummary(summaryRef.current);
    if (isLastStep) {
      onSubmit(submitPayload);
      return;
    }
    setActiveStep((stepIndex) => {
      const nextStepIndex = Math.min(steps.length - 1, stepIndex + 1);
      setMaxCompletedStep((previousMaxCompletedStep) =>
        Math.max(previousMaxCompletedStep, nextStepIndex),
      );
      return nextStepIndex;
    });
  }, [isLastStep, onSubmit, setActiveStep, submitPayload]);

  const handleBack = useCallback(() => {
    setCommittedSummary(summaryRef.current);
    setActiveStep((stepIndex) => Math.max(0, stepIndex - 1));
  }, [setActiveStep]);

  const handleSelectStep = useCallback(
    (stepIndex: number) => {
      setCommittedSummary(summaryRef.current);
      setActiveStep(stepIndex);
    },
    [setActiveStep],
  );

  const stepContent = useMemo(() => {
    const sharedProps = { value, setValue, uiExtras, setUiExtras };
    const stepComponents = [
      <ClientDataStep key="client-data" {...sharedProps} />,
      <TenantStep key="tenant" {...sharedProps} />,
      <PlanStep key="plan" {...sharedProps} />,
      <AdminStep key="admin" {...sharedProps} />,
    ] as const;
    return stepComponents[activeStep] ?? stepComponents[0];
  }, [activeStep, setUiExtras, setValue, uiExtras, value]);

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={layoutSpacing.sectionGap}
      sx={{ alignItems: 'flex-start' }}
    >
      <Paper
        sx={{
          p: 2,
          flex: 1,
          borderRadius: 1.5,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 1px 2px rgba(16,24,40,0.06)',
        }}
      >
        <StepperWizard
          activeStep={activeStep}
          steps={steps}
          onBack={handleBack}
          onCancel={onCancel}
          onNext={handleNext}
          isLastStep={isLastStep}
          nextLabel={isLastStep ? 'Finalizar onboarding' : 'Próximo'}
          nextDisabled={(activeStep === 0 && !isClientDataStepComplete) || (loading && isLastStep)}
        >
          {stepContent}
        </StepperWizard>
      </Paper>

      <OnboardingSummary
        summary={committedSummary}
        activeStep={activeStep}
        maxCompletedStep={maxCompletedStep}
        onStepSelect={handleSelectStep}
      />
    </Stack>
  );
};
