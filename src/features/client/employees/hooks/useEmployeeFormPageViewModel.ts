import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  buildEmployeeInitialValues,
  normalizeEmployeeInitialValues,
  normalizeEmployeePayload,
} from '@features/client/employees/normalizers/employeeFormNormalizer';
import {
  employeeFormSchema,
  type EmployeeFormValues,
} from '@features/client/employees/schemas/employeeFormSchema';
import { employeeService } from '@features/client/employees/services/employeeServices';

const backPath = '/client/employees';

export const useEmployeeFormPageViewModel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const form = useAppForm<EmployeeFormValues>(employeeFormSchema, buildEmployeeInitialValues());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const employee = await employeeService.getById(id);
      form.reset(normalizeEmployeeInitialValues(employee));
    } catch {
      setErrorMessage('Não foi possível carregar o funcionário.');
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

  const submit = async (values: EmployeeFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      const payload = normalizeEmployeePayload(values);
      if (id) {
        await employeeService.update(id, payload);
      } else {
        await employeeService.create(payload);
      }
      void navigate(backPath);
    } catch {
      setErrorMessage('Não foi possível salvar o funcionário.');
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
