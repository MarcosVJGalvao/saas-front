import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import type {
  EntityDetailsPageContent,
  EntityDetailsPageData,
  EntityDetailsViewState,
} from '@shared/components/data-display/details/entityDetails.types';
import { formatIsoDate } from '@shared/formatters';
import { maskCnpj, maskCpf } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import { employeeStatusLabels } from '@shared/i18n/pt-BR/enums';
import { employeeService } from '@features/client/employees/services/employeeServices';
import type { Employee } from '@features/client/employees/types/employee.types';

const content: EntityDetailsPageContent = {
  pageTitle: 'Detalhes do funcionário',
  pageSubtitle: 'Consulte dados profissionais e vínculo pessoal.',
  loadingLabel: 'Carregando funcionário...',
  emptyTitle: 'Funcionário não encontrado',
  emptyMessage: 'Não encontramos o funcionário solicitado.',
  errorFallback: 'Erro ao carregar funcionário.',
  unauthorizedTitle: 'Acesso não autorizado',
  unauthorizedMessage: 'Faça login novamente para consultar este funcionário.',
  forbiddenTitle: 'Acesso negado',
  forbiddenMessage: 'Você não possui permissão para consultar este funcionário.',
};

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const formatDocument = (employee: Employee): string => {
  const documentNumber = employee.person?.documentNumber;
  if (!documentNumber) return '-';
  const digits = onlyDigits(documentNumber);
  if (digits.length === 11) return maskCpf(digits);
  if (digits.length === 14) return maskCnpj(digits);
  return documentNumber;
};

export const useEmployeeDetailsPageViewModel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) {
      setEmployee(null);
      return;
    }
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const response = await employeeService.getById(id);
      setEmployee(response);
    } catch {
      setErrorMessage('Erro ao carregar funcionário.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const viewState: EntityDetailsViewState = loading
    ? 'loading'
    : errorMessage
      ? 'error'
      : employee
        ? 'ready'
        : 'empty';

  const data: EntityDetailsPageData = useMemo(
    () => ({
      headerData: employee
        ? {
            title: employee.person?.fullName ?? employee.jobTitle,
            subtitle: employee.jobTitle,
            avatarFallback: (employee.person?.fullName ?? employee.jobTitle)
              .slice(0, 1)
              .toUpperCase(),
            statusLabel: employee.status ? employeeStatusLabels[employee.status] : undefined,
            statusColor: employee.status === 'active' ? 'success' : 'default',
          }
        : null,
      tabs: employee
        ? [
            {
              id: 'summary',
              label: 'Resumo',
              sections: [
                {
                  id: 'professional',
                  title: 'Dados profissionais',
                  items: [
                    { label: 'Cargo', value: employee.jobTitle },
                    { label: 'Departamento', value: employee.department ?? '-' },
                    {
                      label: 'Status',
                      value: employee.status ? employeeStatusLabels[employee.status] : '-',
                    },
                  ],
                },
                {
                  id: 'person',
                  title: 'Pessoa vinculada',
                  items: [
                    { label: 'Nome', value: employee.person?.fullName ?? '-' },
                    { label: 'Documento', value: formatDocument(employee) },
                  ],
                },
                {
                  id: 'control',
                  title: 'Controle',
                  items: [
                    { label: 'Criado em', value: formatDate(employee.createdAt) },
                    { label: 'Atualizado em', value: formatDate(employee.updatedAt) },
                  ],
                },
              ],
            },
          ]
        : [],
    }),
    [employee],
  );

  return {
    content,
    data,
    viewState,
    errorMessage,
    onBack: () => void navigate('/client/employees'),
    onRetry: load,
  };
};

export const EmployeeDetailsPageContent = () => {
  const model = useEmployeeDetailsPageViewModel();
  return (
    <EntityDetailsPage
      viewState={model.viewState}
      content={model.content}
      data={model.data}
      errorMessage={model.errorMessage}
      onBack={model.onBack}
      onRetry={() => {
        void model.onRetry();
      }}
    />
  );
};
