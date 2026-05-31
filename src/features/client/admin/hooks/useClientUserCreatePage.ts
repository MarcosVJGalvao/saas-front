import { useCallback, useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createOptionsWithPlaceholder } from '@shared/constants/selectOptions';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  getEmployeeContactEmail,
  toClientUserCreatePayload,
  toEmployeeSelectOption,
} from '@features/client/admin/normalizers/clientUserForm.normalizer';
import {
  clientUserCreateFormSchema,
  type ClientUserCreateFormValues,
} from '@features/client/admin/schemas/clientUserCreateForm.schema';
import { clientUsersService } from '@features/client/admin/services/service';
import { employeeService } from '@features/client/employees/services/service';
import type { Employee } from '@features/client/employees/types/employee.types';

const initialValues: ClientUserCreateFormValues = {
  employeeId: '',
  email: '',
  password: '',
};

const EMPLOYEE_REFERENCE_LIMIT = 100;

const hasEmployeeId = (employee: Employee, employeeId: string): boolean =>
  employee.id === employeeId;

export const useClientUserCreatePage = () => {
  const navigate = useNavigate();
  const form = useAppForm<ClientUserCreateFormValues>(clientUserCreateFormSchema, initialValues);
  const selectedEmployeeId = useWatch({
    control: form.control,
    name: 'employeeId',
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [resolvingEmployeeEmail, setResolvingEmployeeEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const selectedEmployee = employees.find((employee) =>
    selectedEmployeeId ? hasEmployeeId(employee, selectedEmployeeId) : false,
  );
  const employeeContactEmail = selectedEmployee
    ? getEmployeeContactEmail(selectedEmployee)
    : undefined;
  const emailFieldDisabled = Boolean(employeeContactEmail);

  const loadEmployees = useCallback(async (): Promise<void> => {
    setLoadingEmployees(true);
    setErrorMessage(undefined);

    try {
      const response = await employeeService.list({ page: 1, limit: EMPLOYEE_REFERENCE_LIMIT });
      setEmployees(response.data);
    } catch {
      setErrorMessage('Nao foi possivel carregar os funcionarios disponiveis.');
    } finally {
      setLoadingEmployees(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadEmployees();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadEmployees]);

  useEffect(() => {
    if (!selectedEmployeeId) {
      form.setValue('email', '');
      return;
    }

    let isActive = true;
    const timeoutId = window.setTimeout(() => {
      const resolveEmployeeEmail = async (): Promise<void> => {
        setResolvingEmployeeEmail(true);
        setErrorMessage(undefined);

        try {
          const employeeDetails = await employeeService.getById(selectedEmployeeId);

          if (!isActive) {
            return;
          }

          const employeeEmail = getEmployeeContactEmail(employeeDetails);

          setEmployees((currentEmployees) => {
            const hasExistingEmployee = currentEmployees.some((employee) =>
              hasEmployeeId(employee, employeeDetails.id),
            );

            return hasExistingEmployee
              ? currentEmployees.map((employee) =>
                  hasEmployeeId(employee, employeeDetails.id) ? employeeDetails : employee,
                )
              : [...currentEmployees, employeeDetails];
          });

          form.setValue('email', employeeEmail ?? '', { shouldValidate: true, shouldDirty: true });
        } catch {
          if (!isActive) {
            return;
          }

          setErrorMessage('Nao foi possivel carregar o contato do funcionario selecionado.');
          form.setValue('email', '', { shouldValidate: true, shouldDirty: true });
        } finally {
          if (isActive) {
            setResolvingEmployeeEmail(false);
          }
        }
      };

      void resolveEmployeeEmail();
    }, 0);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [form, selectedEmployeeId]);

  return {
    form,
    employeeOptions: createOptionsWithPlaceholder(employees.map(toEmployeeSelectOption)),
    loadingEmployees,
    resolvingEmployeeEmail,
    emailFieldDisabled,
    submitting: form.formState.isSubmitting,
    errorMessage,
    onBack: () => {
      void navigate('/client/users');
    },
    onSubmit: async (values: ClientUserCreateFormValues): Promise<void> => {
      setErrorMessage(undefined);

      try {
        await clientUsersService.create(toClientUserCreatePayload(values));
        void navigate('/client/users');
      } catch {
        setErrorMessage('Nao foi possivel criar o usuario. Tente novamente.');
      }
    },
  };
};
