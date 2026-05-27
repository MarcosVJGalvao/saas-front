import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAcademicReferenceOptions } from '@features/client/academic/hooks/useAcademicReferenceOptions';
import {
  buildSchoolClassEditInitialValues,
  normalizeSchoolClassEditInitialValues,
  normalizeSchoolClassEditPayload,
} from '@features/client/academic/normalizers/schoolClassFormNormalizer';
import { schoolClassEditFormSchema } from '@features/client/academic/schemas/schoolClassEditForm.schema';
import type { SchoolClassEditFormValues } from '@features/client/academic/schemas/schoolClassEditForm.schema';
import { schoolClassService } from '@features/client/academic/services/service';
import type { SchoolClass } from '@features/client/academic/types/academic.types';
import { useAppForm } from '@shared/hooks/useAppForm';

type SchoolClassEditLocationState = {
  entity?: SchoolClass;
};

const isSchoolClassEditLocationState = (value: unknown): value is SchoolClassEditLocationState =>
  typeof value === 'object' && value !== null && 'entity' in value;

export const useSchoolClassEditPage = (id: string, locationStateValue: unknown) => {
  const navigate = useNavigate();
  const referenceOptions = useAcademicReferenceOptions({
    includeEducationLevels: true,
  });
  const locationState = isSchoolClassEditLocationState(locationStateValue)
    ? locationStateValue
    : undefined;
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm<SchoolClassEditFormValues>(
    schoolClassEditFormSchema,
    locationState?.entity
      ? normalizeSchoolClassEditInitialValues(locationState.entity)
      : buildSchoolClassEditInitialValues(),
  );

  const load = useCallback(async () => {
    if (locationState?.entity) {
      form.reset(normalizeSchoolClassEditInitialValues(locationState.entity));
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);

    try {
      const response = await schoolClassService.getById(id);
      form.reset(normalizeSchoolClassEditInitialValues(response));
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
      await schoolClassService.update(id, normalizeSchoolClassEditPayload(values));
      void navigate('/client/school-classes');
    } catch {
      setErrorMessage('Não foi possível salvar a turma.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    referenceOptions,
    loading,
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onBack: () => {
      void navigate('/client/school-classes');
    },
  };
};
