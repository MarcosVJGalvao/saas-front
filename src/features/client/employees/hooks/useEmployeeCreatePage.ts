import { useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  createEmployeeInitialValues,
  toEmployeeCreatePayload,
} from '@features/client/employees/normalizers/employeeForm.normalizer';
import { employeeCreateFormSchema } from '@features/client/employees/schemas/employeeCreateForm.schema';
import type { EmployeeCreateFormValues } from '@features/client/employees/schemas/employeeCreateForm.schema';
import { employeeService } from '@features/client/employees/services/service';
import { useState } from 'react';

export const useEmployeeCreatePage = () => {
  const navigate = useNavigate();
  const form = useAppForm<EmployeeCreateFormValues>(
    employeeCreateFormSchema,
    createEmployeeInitialValues(),
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (formValues: EmployeeCreateFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await employeeService.create(toEmployeeCreatePayload(formValues));
      void navigate('/client/employees');
    } catch {
      setErrorMessage('Não foi possível salvar o funcionário.');
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
      void navigate('/client/employees');
    },
  };
};
