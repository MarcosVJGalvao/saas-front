import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { toEmployeeDetailsData } from '@features/client/employees/normalizers/employeeDetails.normalizer';
import { employeeService } from '@features/client/employees/services/service';
import type { Employee } from '@features/client/employees/types/employee.types';

const emptyDetailsData: EntityDetailsPageData = {
  headerData: null,
  tabs: [],
};

export const useEmployeeDetailsPage = (id: string) => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const fetchEmployee = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const fetchedEmployee = await employeeService.getById(id);
      setEmployee(fetchedEmployee);
    } catch {
      setErrorMessage('Erro ao carregar funcionário.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchEmployee();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchEmployee]);

  const viewState: EntityDetailsViewState = loading
    ? 'loading'
    : errorMessage
      ? 'error'
      : employee
        ? 'ready'
        : 'empty';

  return {
    data: employee ? toEmployeeDetailsData(employee) : emptyDetailsData,
    viewState,
    errorMessage,
    onBack: () => {
      void navigate('/client/employees');
    },
    onRetry: fetchEmployee,
  };
};
