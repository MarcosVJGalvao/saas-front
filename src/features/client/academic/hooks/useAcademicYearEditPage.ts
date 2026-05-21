import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FieldPath } from 'react-hook-form';
import { useAppForm } from '@shared/hooks/useAppForm';
import { academicYearWizardSteps } from '@features/client/academic/constants/academicYearWizard';
import {
  buildAcademicYearSummary,
  normalizeAcademicYearInitialValues,
  type AcademicYearSummaryData,
  normalizeAcademicYearPayload,
} from '@features/client/academic/normalizers/academicYearFormNormalizer';
import { academicYearEditFormSchema } from '@features/client/academic/schemas/academicYearEditForm.schema';
import type { AcademicYearEditFormValues } from '@features/client/academic/schemas/academicYearEditForm.schema';
import { academicYearService } from '@features/client/academic/services/service';
import type { AcademicYear } from '@features/client/academic/types/academic.types';

type AcademicYearEditLocationState = {
  entity?: AcademicYear;
};

const isAcademicYearEditLocationState = (value: unknown): value is AcademicYearEditLocationState =>
  typeof value === 'object' && value !== null && 'entity' in value;

const hasCompleteAcademicYearForEdit = (
  academicYear: AcademicYear | undefined,
): academicYear is AcademicYear =>
  academicYear !== undefined &&
  academicYear.reportCardPolicy !== undefined &&
  academicYear.reportCardPolicy !== null &&
  academicYear.academicPeriods !== undefined;

export const useAcademicYearEditPage = (id: string, locationStateValue: unknown) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [maxCompletedStep, setMaxCompletedStep] = useState(0);
  const locationState = isAcademicYearEditLocationState(locationStateValue)
    ? locationStateValue
    : undefined;
  const locationStateEntity = locationState?.entity;
  const hasLocationStateEntity = hasCompleteAcademicYearForEdit(locationStateEntity);
  const [loading, setLoading] = useState(!hasLocationStateEntity);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const isLastStep = activeStep === academicYearWizardSteps.length - 1;
  const form = useAppForm<AcademicYearEditFormValues>(
    academicYearEditFormSchema,
    hasLocationStateEntity && locationStateEntity
      ? normalizeAcademicYearInitialValues(locationStateEntity)
      : {
          reportCardPolicyId: undefined,
          name: '',
          status: 'scheduled',
          startDate: '',
          endDate: '',
          academicPeriods: [
            {
              academicPeriodId: undefined,
              name: '',
              code: '',
              sequence: '1',
              startDate: '',
              endDate: '',
              weight: '',
              isFinalPeriod: false,
            },
          ],
          calculationType: 'arithmetic',
          passingGrade: '',
          minimumAttendancePercentage: '',
          recoveryStrategy: 'none',
          finalStatusStrategy: 'approval_or_recovery',
        },
  );
  const [committedSummary, setCommittedSummary] = useState<AcademicYearSummaryData>(
    buildAcademicYearSummary(form.getValues()),
  );
  const summaryRef = useRef(buildAcademicYearSummary(form.getValues()));

  useEffect(() => {
    const subscription = form.watch(() => {
      summaryRef.current = buildAcademicYearSummary(form.getValues());
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [form]);

  const load = useCallback(async () => {
    if (hasCompleteAcademicYearForEdit(locationStateEntity)) {
      const normalizedInitialValues = normalizeAcademicYearInitialValues(locationStateEntity);
      form.reset(normalizedInitialValues);
      const nextSummary = buildAcademicYearSummary(normalizedInitialValues);
      summaryRef.current = nextSummary;
      setCommittedSummary(nextSummary);
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await academicYearService.getById(id);
      const normalizedInitialValues = normalizeAcademicYearInitialValues(response);
      form.reset(normalizedInitialValues);
      const nextSummary = buildAcademicYearSummary(normalizedInitialValues);
      summaryRef.current = nextSummary;
      setCommittedSummary(nextSummary);
    } catch {
      setErrorMessage('Não foi possível carregar o ano letivo.');
    } finally {
      setLoading(false);
    }
  }, [form, id, locationStateEntity]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const handleSubmit = async (values: AcademicYearEditFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await academicYearService.update(id, normalizeAcademicYearPayload(values));
      void navigate('/client/academic-years');
    } catch {
      setErrorMessage('Não foi possível salvar o ano letivo.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStepFields = (): FieldPath<AcademicYearEditFormValues>[] | 'academicPeriods' => {
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
    loading,
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
