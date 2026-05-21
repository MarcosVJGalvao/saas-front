import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FieldPath } from 'react-hook-form';
import { useAppForm } from '@shared/hooks/useAppForm';
import { academicYearWizardSteps } from '@features/client/academic/constants/academicYearWizard';
import {
  buildAcademicYearSummary,
  buildAcademicYearInitialValues,
  type AcademicYearSummaryData,
  normalizeAcademicYearPayload,
} from '@features/client/academic/normalizers/academicYearFormNormalizer';
import { academicYearCreateFormSchema } from '@features/client/academic/schemas/academicYearCreateForm.schema';
import type { AcademicYearCreateFormValues } from '@features/client/academic/schemas/academicYearCreateForm.schema';
import { academicYearService } from '@features/client/academic/services/service';

export const useAcademicYearCreatePage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [maxCompletedStep, setMaxCompletedStep] = useState(0);
  const form = useAppForm<AcademicYearCreateFormValues>(
    academicYearCreateFormSchema,
    buildAcademicYearInitialValues(),
  );
  const [committedSummary, setCommittedSummary] = useState<AcademicYearSummaryData>(
    buildAcademicYearSummary(form.getValues()),
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const isLastStep = activeStep === academicYearWizardSteps.length - 1;
  const summaryRef = useRef(buildAcademicYearSummary(form.getValues()));

  useEffect(() => {
    const subscription = form.watch(() => {
      summaryRef.current = buildAcademicYearSummary(form.getValues());
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [form]);

  const handleSubmit = async (values: AcademicYearCreateFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await academicYearService.create(normalizeAcademicYearPayload(values));
      void navigate('/client/academic-years');
    } catch {
      setErrorMessage('Não foi possível salvar o ano letivo.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStepFields = (): FieldPath<AcademicYearCreateFormValues>[] | 'academicPeriods' => {
    if (activeStep === 0) {
      return ['name', 'status', 'startDate', 'endDate'];
    }

    if (activeStep === 1) {
      return 'academicPeriods';
    }

    return [
      'calculationType',
      'passingGrade',
      'minimumAttendancePercentage',
      'recoveryStrategy',
      'finalStatusStrategy',
    ];
  };

  const handleNext = async (): Promise<void> => {
    const isCurrentStepValid = await form.trigger(getStepFields());

    if (!isCurrentStepValid) {
      return;
    }

    setCommittedSummary(summaryRef.current);

    if (isLastStep) {
      await form.handleSubmit(handleSubmit)();
      return;
    }

    setActiveStep((currentStep) => {
      const nextStep = Math.min(currentStep + 1, academicYearWizardSteps.length - 1);
      setMaxCompletedStep((currentMaxCompletedStep) => Math.max(currentMaxCompletedStep, nextStep));
      return nextStep;
    });
  };

  return {
    form,
    activeStep,
    maxCompletedStep,
    committedSummary,
    steps: academicYearWizardSteps,
    isLastStep,
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onNext: handleNext,
    onPrevious: () => {
      setActiveStep((currentStep) => Math.max(0, currentStep - 1));
    },
    onStepSelect: (stepIndex: number) => {
      setCommittedSummary(summaryRef.current);
      setActiveStep(stepIndex);
    },
    onBack: () => {
      void navigate('/client/academic-years');
    },
  };
};
