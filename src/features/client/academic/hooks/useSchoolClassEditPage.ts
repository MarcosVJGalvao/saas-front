import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  normalizeSchoolClassInitialValues,
  normalizeSchoolClassPayload,
} from '@features/client/academic/normalizers/schoolClassFormNormalizer';
import { schoolClassEditFormSchema } from '@features/client/academic/schemas/schoolClassEditForm.schema';
import type { SchoolClassEditFormValues } from '@features/client/academic/schemas/schoolClassEditForm.schema';
import { schoolClassService } from '@features/client/academic/services/service';
import type { SchoolClass } from '@features/client/academic/types/academic.types';

type SchoolClassEditLocationState = {
  entity?: SchoolClass;
};

const isSchoolClassEditLocationState = (value: unknown): value is SchoolClassEditLocationState =>
  typeof value === 'object' && value !== null && 'entity' in value;

export const useSchoolClassEditPage = (id: string, locationStateValue: unknown) => {
  const navigate = useNavigate();
  const locationState = isSchoolClassEditLocationState(locationStateValue)
    ? locationStateValue
    : undefined;
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm<SchoolClassEditFormValues>(
    schoolClassEditFormSchema,
    locationState?.entity
      ? normalizeSchoolClassInitialValues(locationState.entity)
      : {
          name: '',
          code: '',
          status: 'active',
          shift: 'morning',
          capacity: '',
          academicYearId: '',
          gradeId: '',
          educationLevelId: '',
          description: '',
        },
  );

  const load = useCallback(async () => {
    if (locationState?.entity) {
      form.reset(normalizeSchoolClassInitialValues(locationState.entity));
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await schoolClassService.getById(id);
      form.reset(normalizeSchoolClassInitialValues(response));
    } catch {
      setErrorMessage('Não foi possível carregar a turma.');
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

  const handleSubmit = async (values: SchoolClassEditFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await schoolClassService.update(id, normalizeSchoolClassPayload(values));
      void navigate('/client/school-classes');
    } catch {
      setErrorMessage('Não foi possível salvar a turma.');
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
      void navigate('/client/school-classes');
    },
  };
};
