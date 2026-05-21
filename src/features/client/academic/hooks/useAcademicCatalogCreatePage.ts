import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  buildAcademicCatalogInitialValues,
  toAcademicCatalogCreatePayload,
} from '@features/client/academic/normalizers/academicCatalogFormNormalizer';
import { academicCatalogCreateFormSchema } from '@features/client/academic/schemas/academicCatalogCreateForm.schema';
import type { AcademicCatalogCreateFormValues } from '@features/client/academic/schemas/academicCatalogCreateForm.schema';
import type { AcademicCatalogItem } from '@features/client/academic/types/academic.types';

type AcademicCatalogCreateService = {
  create: (payload: Record<string, unknown>) => Promise<AcademicCatalogItem>;
};

type UseAcademicCatalogCreatePageParams = {
  service: AcademicCatalogCreateService;
  backPath: string;
  submitErrorMessage: string;
};

export const useAcademicCatalogCreatePage = ({
  service,
  backPath,
  submitErrorMessage,
}: UseAcademicCatalogCreatePageParams) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm<AcademicCatalogCreateFormValues>(
    academicCatalogCreateFormSchema,
    buildAcademicCatalogInitialValues(),
  );

  const handleSubmit = async (values: AcademicCatalogCreateFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await service.create(toAcademicCatalogCreatePayload(values));
      void navigate(backPath);
    } catch {
      setErrorMessage(submitErrorMessage);
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
      void navigate(backPath);
    },
  };
};
