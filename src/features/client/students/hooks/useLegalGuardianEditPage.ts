import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { isRecord } from '@shared/utils/isRecord';
import {
  toLegalGuardianEditFormValues,
  toLegalGuardianEditPayload,
} from '../normalizers/legalGuardianForm.normalizer';
import {
  legalGuardianEditFormSchema,
  type LegalGuardianEditFormValues,
} from '../schemas/legalGuardianEditForm.schema';
import { legalGuardianService } from '../services/service';
import type { LegalGuardian } from '../types/student.types';

const isLegalGuardianEntity = (value: unknown): value is LegalGuardian =>
  isRecord(value) && typeof value.id === 'string';

const getLocationEntity = (value: unknown): LegalGuardian | null => {
  if (!isRecord(value)) return null;
  const candidate = value.entity;
  return isLegalGuardianEntity(candidate) ? candidate : null;
};

export const useLegalGuardianEditPage = (id: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationEntity = getLocationEntity(location.state);
  const form = useAppForm(
    legalGuardianEditFormSchema,
    toLegalGuardianEditFormValues(locationEntity ?? { id: '' }),
  );
  const [entity, setEntity] = useState<LegalGuardian | null>(locationEntity);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    if (locationEntity) {
      form.reset(toLegalGuardianEditFormValues(locationEntity));
    }
  }, [form, locationEntity]);

  const fetchLegalGuardian = useCallback(async () => {
    if (locationEntity) return;
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const fetchedLegalGuardian = await legalGuardianService.getById(id);
      setEntity(fetchedLegalGuardian);
      form.reset(toLegalGuardianEditFormValues(fetchedLegalGuardian));
    } catch {
      setErrorMessage('Não foi possível carregar o responsável.');
    } finally {
      setLoading(false);
    }
  }, [form, id, locationEntity]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchLegalGuardian();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchLegalGuardian]);

  const onSubmit = async (values: LegalGuardianEditFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await legalGuardianService.update(id, toLegalGuardianEditPayload(values));
      void navigate('/client/legal-guardians');
    } catch {
      setErrorMessage('Não foi possível salvar o responsável.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    entity,
    loading,
    submitting,
    errorMessage,
    onSubmit,
    onBack: () => {
      void navigate('/client/legal-guardians');
    },
  };
};
