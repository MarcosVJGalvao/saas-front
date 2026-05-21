import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  buildSchoolClassInitialValues,
  normalizeSchoolClassPayload,
} from '@features/client/academic/normalizers/schoolClassFormNormalizer';
import { schoolClassCreateFormSchema } from '@features/client/academic/schemas/schoolClassCreateForm.schema';
import type { SchoolClassCreateFormValues } from '@features/client/academic/schemas/schoolClassCreateForm.schema';
import { schoolClassService } from '@features/client/academic/services/service';
import { useAcademicReferenceOptions } from '@features/client/academic/hooks/useAcademicReferenceOptions';

export const useSchoolClassCreatePage = () => {
  const navigate = useNavigate();
  const referenceOptions = useAcademicReferenceOptions({
    includeEducationLevels: true,
  });
  const form = useAppForm<SchoolClassCreateFormValues>(
    schoolClassCreateFormSchema,
    buildSchoolClassInitialValues(),
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (values: SchoolClassCreateFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await schoolClassService.create(normalizeSchoolClassPayload(values));
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
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onBack: () => {
      void navigate('/client/school-classes');
    },
  };
};
