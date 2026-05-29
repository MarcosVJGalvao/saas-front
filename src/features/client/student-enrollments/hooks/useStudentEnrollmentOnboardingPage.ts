import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentEnrollmentService } from '@features/client/student-enrollments/services/service';
import { useStudentEnrollmentOnboardingForm } from '@features/client/student-enrollments/hooks/useStudentEnrollmentOnboardingForm';
import { useStudentEnrollmentReferenceOptions } from '@features/client/student-enrollments/hooks/useStudentEnrollmentReferenceOptions';
import type { StudentEnrollmentSummaryData } from '@features/client/student-enrollments/types/studentEnrollmentOnboarding.types';

const onboardingSteps = [
  'Aluno',
  'Responsáveis',
  'Endereço e Contatos',
  'Informações Médicas',
  'Dados Acadêmicos',
  'Revisão',
];

export const useStudentEnrollmentOnboardingPage = () => {
  const navigate = useNavigate();
  const onboardingForm = useStudentEnrollmentOnboardingForm();
  const referenceOptions = useStudentEnrollmentReferenceOptions();
  const [committedSummary, setCommittedSummary] = useState<StudentEnrollmentSummaryData>(
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

  const createEnrollment = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const createdEnrollment = await studentEnrollmentService.create(onboardingForm.payload);
      void navigate(`/client/student-enrollments/${createdEnrollment.id}`);
    } catch {
      setErrorMessage('Não foi possível finalizar a matrícula. Revise os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [navigate, onboardingForm.payload]);

  const handleNext = useCallback(() => {
    setCommittedSummary(summaryRef.current);

    if (isLastStep) {
      void createEnrollment();
      return;
    }

    onboardingForm.setActiveStep((currentStepIndex) => {
      const nextStepIndex = Math.min(onboardingSteps.length - 1, currentStepIndex + 1);
      setMaxCompletedStep((currentMaxCompletedStep) =>
        Math.max(currentMaxCompletedStep, nextStepIndex),
      );
      return nextStepIndex;
    });
  }, [createEnrollment, isLastStep, onboardingForm]);

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
      referenceOptions,
    },
    handleNext,
    onCancel: () => navigate('/client/student-enrollments'),
    onBack: () =>
      onboardingForm.setActiveStep((currentStepIndex) => Math.max(0, currentStepIndex - 1)),
    onStepSelect: (stepIndex: number) => {
      setCommittedSummary(summaryRef.current);
      onboardingForm.setActiveStep(stepIndex);
    },
    nextDisabled:
      (onboardingForm.activeStep === 0 && !onboardingForm.isStudentStepComplete) ||
      (onboardingForm.activeStep === 1 && !onboardingForm.isGuardianStepComplete) ||
      (onboardingForm.activeStep === 4 && !onboardingForm.isAcademicStepComplete) ||
      (loading && isLastStep),
    nextDisabledTooltip:
      onboardingForm.activeStep === 0 && !onboardingForm.isStudentStepComplete
        ? 'Selecione um aluno ou preencha nome e documento para continuar.'
        : onboardingForm.activeStep === 1 && !onboardingForm.isGuardianStepComplete
          ? 'Preencha o nome completo de todos os responsáveis para continuar.'
          : onboardingForm.activeStep === 4 && !onboardingForm.isAcademicStepComplete
            ? 'Selecione o ano letivo e a data de matrícula para continuar.'
            : undefined,
  };
};
