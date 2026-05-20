import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  createLegalGuardianInitialValues,
  toLegalGuardianCreatePayload,
} from '../normalizers/legalGuardianForm.normalizer';
import {
  legalGuardianCreateFormSchema,
  type LegalGuardianCreateFormValues,
} from '../schemas/legalGuardianCreateForm.schema';
import { legalGuardianService } from '../services/service';

export const useLegalGuardianCreatePage = () => {
  const navigate = useNavigate();
  const form = useAppForm(legalGuardianCreateFormSchema, createLegalGuardianInitialValues());
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const onSubmit = async (values: LegalGuardianCreateFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await legalGuardianService.create(toLegalGuardianCreatePayload(values));
      void navigate('/client/legal-guardians');
    } catch {
      setErrorMessage('Não foi possível salvar o responsável.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    submitting,
    errorMessage,
    onSubmit,
    onBack: () => {
      void navigate('/client/legal-guardians');
    },
  };
};
