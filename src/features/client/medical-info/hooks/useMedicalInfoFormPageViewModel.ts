import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  buildMedicalInfoInitialValues,
  normalizeMedicalInfoInitialValues,
  normalizeMedicalInfoPayload,
} from '@features/client/medical-info/normalizers/medicalInfoFormNormalizer';
import {
  medicalInfoFormSchema,
  type MedicalInfoFormValues,
} from '@features/client/medical-info/schemas/medicalInfoFormSchema';
import { medicalInfoService } from '@features/client/medical-info/services/medicalInfoServices';

const backPath = '/client/medical-info';

export const useMedicalInfoFormPageViewModel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const form = useAppForm<MedicalInfoFormValues>(
    medicalInfoFormSchema,
    buildMedicalInfoInitialValues(),
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const medicalInfo = await medicalInfoService.getById(id);
      form.reset(normalizeMedicalInfoInitialValues(medicalInfo));
    } catch {
      setErrorMessage('Não foi possível carregar o registro médico.');
    } finally {
      setLoading(false);
    }
  }, [form, id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const submit = async (values: MedicalInfoFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      const payload = normalizeMedicalInfoPayload(values);
      if (id) {
        await medicalInfoService.update(id, payload);
      } else {
        await medicalInfoService.create(payload);
      }
      void navigate(backPath);
    } catch {
      setErrorMessage('Não foi possível salvar o registro médico.');
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
