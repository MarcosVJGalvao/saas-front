import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useStudentEnrollmentOnboardingForm,
  type UseStudentEnrollmentOnboardingFormResult,
} from '@features/client/student-enrollments/hooks/useStudentEnrollmentOnboardingForm';
import { studentEnrollmentService } from '@features/client/student-enrollments/services/studentEnrollmentService';
import type { StudentEnrollmentSummaryData } from '@features/client/student-enrollments/types/studentEnrollment.types';

interface StudentEnrollmentOnboardingPageViewModel {
  steps: string[];
  activeStep: number;
  isLastStep: boolean;
  committedSummary: StudentEnrollmentSummaryData;
  maxCompletedStep: number;
  loading: boolean;
  errorMessage?: string | undefined;
  form: Pick<UseStudentEnrollmentOnboardingFormResult, 'value' | 'uiExtras' | 'actions'>;
  handleNext: () => void;
  onCancel: () => void;
  onBack: () => void;
  onStepSelect: (stepIndex: number) => void;
  nextDisabled: boolean;
}

const steps = [
  'Aluno',
  'Responsáveis',
  'Endereço e Contatos',
  'Informações Médicas',
  'Dados Acadêmicos',
  'Revisão',
];

export const useStudentEnrollmentOnboardingPageViewModel =
  (): StudentEnrollmentOnboardingPageViewModel => {
    const navigate = useNavigate();
    const form = useStudentEnrollmentOnboardingForm();
    const [committedSummary, setCommittedSummary] = useState(form.summary);
    const [maxCompletedStep, setMaxCompletedStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const summaryRef = useRef(form.summary);

    useEffect(() => {
      summaryRef.current = form.summary;
    }, [form.summary]);

    const isLastStep = form.activeStep === steps.length - 1;

    const createEnrollment = useCallback(async () => {
      setLoading(true);
      setErrorMessage(undefined);
      try {
        const enrollment = await studentEnrollmentService.create(form.payload);
        void navigate(`/client/student-enrollments/${enrollment.id}`);
      } catch {
        setErrorMessage(
          'Não foi possível finalizar a matrícula. Revise os dados e tente novamente.',
        );
      } finally {
        setLoading(false);
      }
    }, [form.payload, navigate]);

    const handleNext = useCallback(() => {
      setCommittedSummary(summaryRef.current);
      if (isLastStep) {
        void createEnrollment();
        return;
      }

      form.setActiveStep((stepIndex) => {
        const nextStepIndex = Math.min(steps.length - 1, stepIndex + 1);
        setMaxCompletedStep((previousMaxCompletedStep) =>
          Math.max(previousMaxCompletedStep, nextStepIndex),
        );
        return nextStepIndex;
      });
    }, [createEnrollment, form, isLastStep]);

    return {
      steps,
      activeStep: form.activeStep,
      isLastStep,
      committedSummary,
      maxCompletedStep,
      loading,
      errorMessage,
      form: { value: form.value, uiExtras: form.uiExtras, actions: form.actions },
      handleNext,
      onCancel: () => void navigate('/client/student-enrollments'),
      onBack: () => form.setActiveStep((stepIndex) => Math.max(0, stepIndex - 1)),
      onStepSelect: (stepIndex) => {
        setCommittedSummary(summaryRef.current);
        form.setActiveStep(stepIndex);
      },
      nextDisabled:
        (form.activeStep === 0 && !form.isStudentStepComplete) ||
        (form.activeStep === 1 && !form.isGuardianStepComplete) ||
        (form.activeStep === 4 && !form.isAcademicStepComplete) ||
        (loading && isLastStep),
    };
  };
