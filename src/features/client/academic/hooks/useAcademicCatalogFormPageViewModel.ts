import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  academicCatalogFormSchema,
  type AcademicCatalogFormValues,
} from '@features/client/academic/schemas/academicCatalogFormSchema';
import {
  buildAcademicCatalogInitialValues,
  normalizeAcademicCatalogInitialValues,
  normalizeAcademicCatalogPayload,
} from '@features/client/academic/normalizers/academicCatalogFormNormalizer';
import type { AcademicCatalogItem } from '@features/client/academic/types/academic.types';

type AcademicCatalogFormService = {
  getById: (id: string) => Promise<AcademicCatalogItem>;
  create: (payload: Record<string, unknown>) => Promise<AcademicCatalogItem>;
  update: (id: string, payload: Record<string, unknown>) => Promise<AcademicCatalogItem>;
};

type AcademicCatalogFormPageViewModelParams = {
  service: AcademicCatalogFormService;
  backPath: string;
  loadErrorMessage: string;
  submitErrorMessage: string;
};

export const useAcademicCatalogFormPageViewModel = ({
  service,
  backPath,
  loadErrorMessage,
  submitErrorMessage,
}: AcademicCatalogFormPageViewModelParams) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const form = useAppForm<AcademicCatalogFormValues>(
    academicCatalogFormSchema,
    buildAcademicCatalogInitialValues(),
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setErrorMessage(undefined);

    try {
      const response = await service.getById(id);
      form.reset(normalizeAcademicCatalogInitialValues(response));
    } catch {
      setErrorMessage(loadErrorMessage);
    } finally {
      setLoading(false);
    }
  }, [form, id, loadErrorMessage, service]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const submit = async (values: AcademicCatalogFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);

    try {
      const payload = normalizeAcademicCatalogPayload(values);
      if (id) {
        await service.update(id, payload);
      } else {
        await service.create(payload);
      }
      void navigate(backPath);
    } catch {
      setErrorMessage(submitErrorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    isEdit,
    loading,
    submitting,
    errorMessage,
    onBack: () => void navigate(backPath),
    onSubmit: submit,
  };
};
