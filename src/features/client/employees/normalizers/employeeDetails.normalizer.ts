import { formatIsoDate } from '@shared/formatters';
import { createOptionalLocalizedStatusBadge } from '@shared/components/data-display/statusBadge.utils';
import { employeeStatusLabels } from '@shared/i18n/pt-BR/enums';
import { maskCnpj, maskCpf } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import type { EntityDetailsPageData } from '@shared/components/data-display/details/entityDetails.types';
import type { Employee } from '@features/client/employees/types/employee.types';

const formatDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const formatEmployeeDocument = (employee: Employee): string => {
  const documentNumber = employee.person?.documentNumber;
  if (!documentNumber) {
    return '-';
  }

  const digits = onlyDigits(documentNumber);
  if (digits.length === 11) {
    return maskCpf(digits);
  }
  if (digits.length === 14) {
    return maskCnpj(digits);
  }
  return documentNumber;
};

const renderEmployeeStatus = (status: Employee['status'] | undefined) =>
  createOptionalLocalizedStatusBadge(
    status ? employeeStatusLabels[status] : undefined,
    status === 'active' ? 'active' : 'neutral',
  );

export const toEmployeeDetailsData = (employee: Employee): EntityDetailsPageData => ({
  headerData: {
    title: employee.person?.fullName ?? employee.jobTitle,
    subtitle: employee.jobTitle,
    avatarFallback: (employee.person?.fullName ?? employee.jobTitle).slice(0, 1).toUpperCase(),
    statusLabel: employee.status ? employeeStatusLabels[employee.status] : undefined,
    statusColor: employee.status === 'active' ? 'success' : 'default',
  },
  tabs: [
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
            { label: 'Status', value: renderEmployeeStatus(employee.status) },
          ],
        },
        {
          id: 'person',
          title: 'Pessoa vinculada',
          items: [
            { label: 'Nome', value: employee.person?.fullName ?? '-' },
            { label: 'Documento', value: formatEmployeeDocument(employee) },
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
  ],
});
