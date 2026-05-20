import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  buildAcademicYearInitialValues,
  normalizeAcademicYearPayload,
} from '@features/client/academic/normalizers/academicYearFormNormalizer';
import { academicYearCreateFormSchema } from '@features/client/academic/schemas/academicYearCreateForm.schema';
import type { AcademicYearCreateFormValues } from '@features/client/academic/schemas/academicYearCreateForm.schema';
import { academicYearService } from '@features/client/academic/services/service';

export const useAcademicYearCreatePage = () => {
  const navigate = useNavigate();
  const form = useAppForm<AcademicYearCreateFormValues>(
    academicYearCreateFormSchema,
    buildAcademicYearInitialValues(),
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

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

  return {
    form,
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onBack: () => {
      void navigate('/client/academic-years');
    },
  };
};
