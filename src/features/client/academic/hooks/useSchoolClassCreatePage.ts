import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAcademicReferenceOptions } from '@features/client/academic/hooks/useAcademicReferenceOptions';
import {
  buildSchoolClassCreateInitialValues,
  normalizeSchoolClassCreatePayload,
} from '@features/client/academic/normalizers/schoolClassFormNormalizer';
import { schoolClassCreateFormSchema } from '@features/client/academic/schemas/schoolClassCreateForm.schema';
import type { SchoolClassCreateFormValues } from '@features/client/academic/schemas/schoolClassCreateForm.schema';
import { schoolClassService } from '@features/client/academic/services/service';
import { useAppForm } from '@shared/hooks/useAppForm';

export const useSchoolClassCreatePage = () => {
  const navigate = useNavigate();
  const referenceOptions = useAcademicReferenceOptions({
    includeTeachers: true,
    employeeJobTitle: 'coordinator',
  });
  const form = useAppForm<SchoolClassCreateFormValues>(
    schoolClassCreateFormSchema,
    buildSchoolClassCreateInitialValues(),
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (values: SchoolClassCreateFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await schoolClassService.create(normalizeSchoolClassCreatePayload(values));
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
