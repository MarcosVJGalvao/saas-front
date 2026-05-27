import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddressAutoFill } from '@shared/hooks/useAddressAutoFill/useAddressAutoFill';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  createEmployeeInitialValues,
  toEmployeeCreatePayload,
} from '@features/client/employees/normalizers/employeeForm.normalizer';
import { employeeCreateFormSchema } from '@features/client/employees/schemas/employeeCreateForm.schema';
import type { EmployeeCreateFormValues } from '@features/client/employees/schemas/employeeCreateForm.schema';
import { employeeService } from '@features/client/employees/services/service';

export const useEmployeeCreatePage = () => {
  const navigate = useNavigate();
  const form = useAppForm<EmployeeCreateFormValues>(
    employeeCreateFormSchema,
    createEmployeeInitialValues(),
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const addressAutoFill = useAddressAutoFill({
    onResolved: (fields) => {
      if (fields.zipCode !== undefined) {
        form.setValue('zipCode', fields.zipCode, { shouldValidate: true });
      }
      if (fields.street !== undefined) {
        form.setValue('street', fields.street, { shouldValidate: true });
      }
      if (fields.complement !== undefined) {
        form.setValue('complement', fields.complement, { shouldValidate: true });
      }
      if (fields.neighborhood !== undefined) {
        form.setValue('neighborhood', fields.neighborhood, { shouldValidate: true });
      }
      if (fields.city !== undefined) {
        form.setValue('city', fields.city, { shouldValidate: true });
      }
      if (fields.state !== undefined) {
        form.setValue('state', fields.state, { shouldValidate: true });
      }
    },
  });

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

  const handleSearchCep = useCallback(async (): Promise<void> => {
    await addressAutoFill.resolveByCep(form.getValues('zipCode'));
  }, [addressAutoFill, form]);

  return {
    form,
    submitting,
    errorMessage,
    addressLookupLoading: addressAutoFill.loading,
    onSubmit: handleSubmit,
    onSearchCep: handleSearchCep,
    onBack: () => {
      void navigate('/client/employees');
    },
  };
};
