import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { isRecord } from '@shared/utils/isRecord';
import {
  toAcademicCatalogEditFormValues,
  toAcademicCatalogEditPayload,
} from '@features/client/academic/normalizers/academicCatalogFormNormalizer';
import { academicCatalogEditFormSchema } from '@features/client/academic/schemas/academicCatalogEditForm.schema';
import type { AcademicCatalogEditFormValues } from '@features/client/academic/schemas/academicCatalogEditForm.schema';
import type { AcademicCatalogItem } from '@features/client/academic/types/academic.types';

type AcademicCatalogEditService = {
  getById: (id: string) => Promise<AcademicCatalogItem>;
  update: (id: string, payload: Record<string, unknown>) => Promise<AcademicCatalogItem>;
};

type AcademicCatalogEditLocationState = {
  entity?: AcademicCatalogItem;
};

type UseAcademicCatalogEditPageParams = {
  id: string;
  service: AcademicCatalogEditService;
  backPath: string;
  loadErrorMessage: string;
  submitErrorMessage: string;
  buildPayload?: (values: AcademicCatalogEditFormValues) => Record<string, unknown>;
};

const isAcademicCatalogItem = (value: unknown): value is AcademicCatalogItem =>
  isRecord(value) && typeof value.id === 'string' && typeof value.name === 'string';

const getLocationState = (value: unknown): AcademicCatalogEditLocationState | null => {
  if (!isRecord(value)) {
    return null;
  }

  return isAcademicCatalogItem(value.entity) ? { entity: value.entity } : null;
};

export const useAcademicCatalogEditPage = ({
  id,
  service,
  backPath,
  loadErrorMessage,
  submitErrorMessage,
  buildPayload = toAcademicCatalogEditPayload,
}: UseAcademicCatalogEditPageParams) => {
  const serviceRef = useRef(service);
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = getLocationState(location.state);
  const [item, setItem] = useState<AcademicCatalogItem | null>(locationState?.entity ?? null);
  const [loading, setLoading] = useState(locationState?.entity ? false : true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm<AcademicCatalogEditFormValues>(academicCatalogEditFormSchema, {
    name: '',
    code: '',
    status: 'active',
    description: '',
    educationLevelId: '',
  });

  useEffect(() => {
    serviceRef.current = service;
  }, [service]);

  const fetchItem = useCallback(async () => {
    if (locationState?.entity) {
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await serviceRef.current.getById(id);
      setItem(response);
    } catch {
      setErrorMessage(loadErrorMessage);
    } finally {
      setLoading(false);
    }
  }, [id, loadErrorMessage, locationState?.entity]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchItem();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchItem]);

  useEffect(() => {
    if (!item) {
      return;
    }

    form.reset(toAcademicCatalogEditFormValues(item));
  }, [form, item]);

  const handleSubmit = async (values: AcademicCatalogEditFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await serviceRef.current.update(id, buildPayload(values));
      void navigate(`${backPath}/${id}`);
    } catch {
      setErrorMessage(submitErrorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    item,
    loading,
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onBack: () => {
      void navigate(item ? `${backPath}/${item.id}` : backPath);
    },
  };
};
