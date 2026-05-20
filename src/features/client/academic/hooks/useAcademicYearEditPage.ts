import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  normalizeAcademicYearInitialValues,
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

export const useAcademicYearEditPage = (id: string, locationStateValue: unknown) => {
  const navigate = useNavigate();
  const locationState = isAcademicYearEditLocationState(locationStateValue)
    ? locationStateValue
    : undefined;
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm<AcademicYearEditFormValues>(
    academicYearEditFormSchema,
    locationState?.entity
      ? normalizeAcademicYearInitialValues(locationState.entity)
      : {
          name: '',
          status: 'scheduled',
          startDate: '',
          endDate: '',
          periodName: '',
          periodCode: '',
          periodSequence: '',
          periodStartDate: '',
          periodEndDate: '',
          periodWeight: '',
          periodIsFinal: '',
          calculationType: '',
          passingGrade: '',
          minimumAttendancePercentage: '',
          recoveryStrategy: '',
          finalStatusStrategy: '',
          description: '',
        },
  );

  const load = useCallback(async () => {
    if (locationState?.entity) {
      form.reset(normalizeAcademicYearInitialValues(locationState.entity));
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await academicYearService.getById(id);
      form.reset(normalizeAcademicYearInitialValues(response));
    } catch {
      setErrorMessage('Não foi possível carregar o ano letivo.');
    } finally {
      setLoading(false);
    }
  }, [form, id, locationState]);

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

  return {
    form,
    loading,
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onBack: () => {
      void navigate('/client/academic-years');
    },
  };
};
