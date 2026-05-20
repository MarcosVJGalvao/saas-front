import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import { isRecord } from '@shared/utils/isRecord';
import {
  toEmployeeEditFormValues,
  toEmployeeEditPayload,
} from '@features/client/employees/normalizers/employeeForm.normalizer';
import { employeeEditFormSchema } from '@features/client/employees/schemas/employeeEditForm.schema';
import type { EmployeeEditFormValues } from '@features/client/employees/schemas/employeeEditForm.schema';
import { employeeService } from '@features/client/employees/services/service';
import type { Employee } from '@features/client/employees/types/employee.types';

type EmployeeEditLocationState = {
  entity?: Employee;
};

const isEmployee = (value: unknown): value is Employee =>
  isRecord(value) && typeof value.id === 'string' && typeof value.jobTitle === 'string';

const getLocationState = (value: unknown): EmployeeEditLocationState | null => {
  if (!isRecord(value)) {
    return null;
  }

  return isEmployee(value.entity) ? { entity: value.entity } : null;
};

export const useEmployeeEditPage = (id: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = getLocationState(location.state);
  const [employee, setEmployee] = useState<Employee | null>(locationState?.entity ?? null);
  const [loading, setLoading] = useState(locationState?.entity ? false : true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const form = useAppForm<EmployeeEditFormValues>(employeeEditFormSchema, {
    jobTitle: '',
    department: '',
    status: '',
  });

  const fetchEmployee = useCallback(async () => {
    if (locationState?.entity) {
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);
    try {
      const fetchedEmployee = await employeeService.getById(id);
      setEmployee(fetchedEmployee);
    } catch {
      setErrorMessage('Não foi possível carregar o funcionário.');
    } finally {
      setLoading(false);
    }
  }, [id, locationState?.entity]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchEmployee();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchEmployee]);

  useEffect(() => {
    if (!employee) {
      return;
    }

    form.reset(toEmployeeEditFormValues(employee));
  }, [employee, form]);

  const handleSubmit = async (formValues: EmployeeEditFormValues): Promise<void> => {
    setSubmitting(true);
    setErrorMessage(undefined);
    try {
      await employeeService.update(id, toEmployeeEditPayload(formValues));
      void navigate(`/client/employees/${id}`);
    } catch {
      setErrorMessage('Não foi possível salvar o funcionário.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    employee,
    loading,
    submitting,
    errorMessage,
    onSubmit: handleSubmit,
    onBack: () => {
      void navigate(employee ? `/client/employees/${employee.id}` : '/client/employees');
    },
  };
};
