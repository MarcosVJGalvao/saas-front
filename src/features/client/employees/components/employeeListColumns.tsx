import { createOptionalLocalizedStatusBadge } from '@shared/components/data-display/statusBadge.utils';
import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import {
  employeeStatusLabels,
  translateEmployeeJobTitle,
  type EmployeeJobTitleValue,
} from '@shared/i18n/pt-BR/enums';
import { maskCnpj, maskCpf } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import type { Employee } from '@features/client/employees/types/employee.types';

export interface EmployeeColumnActions {
  onDetails: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
}

const getEmployeePerson = (employee: Employee): Employee['person'] =>
  employee.person ?? employee.employee?.person;

const getEmployeeJobTitle = (employee: Employee): string | undefined =>
  employee.jobTitle ?? employee.employee?.jobTitle;

const isEmployeeJobTitle = (value: string): value is EmployeeJobTitleValue =>
  value === 'teacher' ||
  value === 'teaching_assistant' ||
  value === 'coordinator' ||
  value === 'director' ||
  value === 'secretary' ||
  value === 'financial' ||
  value === 'administrator' ||
  value === 'administrative' ||
  value === 'assistant' ||
  value === 'other';

const getEmployeeFullName = (employee: Employee): string => {
  const fullName = getEmployeePerson(employee)?.fullName?.trim() ?? '';
  return fullName.length > 0 ? fullName : '-';
};

const getEmployeeEmail = (employee: Employee): string => {
  const email = employee.email?.trim() ?? '';
  return email.length > 0 ? email : '-';
};

const getEmployeeRoleName = (employee: Employee): string => {
  const roleName = employee.roles?.[0]?.role.name.trim() ?? '';
  return roleName.length > 0 ? roleName : '-';
};

const formatEmployeeDocument = (employee: Employee): string => {
  const documentNumber = getEmployeePerson(employee)?.documentNumber;
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

const formatEmployeeName = (employee: Employee): string => getEmployeeFullName(employee);

const formatEmployeeJobTitle = (employee: Employee): string => {
  const jobTitle = getEmployeeJobTitle(employee);
  return jobTitle && isEmployeeJobTitle(jobTitle) ? translateEmployeeJobTitle(jobTitle) : '-';
};

const renderEmployeeStatus = (employee: Employee) =>
  createOptionalLocalizedStatusBadge(
    employee.status ? employeeStatusLabels[employee.status] : undefined,
    employee.status === 'active' ? 'active' : 'neutral',
  );

export const buildEmployeeColumns = (
  actions: EmployeeColumnActions,
): DataTableColumn<Employee>[] => [
  { key: 'name', header: 'Nome', render: formatEmployeeName, width: '28%' },
  {
    key: 'jobTitle',
    header: 'Cargo',
    render: formatEmployeeJobTitle,
    width: '18%',
  },
  {
    key: 'email',
    header: 'E-mail',
    render: getEmployeeEmail,
    width: '30%',
  },
  { key: 'documentNumber', header: 'Documento', render: formatEmployeeDocument, width: '16%' },
  {
    key: 'status',
    header: 'Status',
    render: renderEmployeeStatus,
    width: '12%',
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    width: '10%',
    render: (employee) => (
      <RowActionsMenu
        actions={[
          { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(employee) },
          { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(employee) },
        ]}
      />
    ),
  },
];

export const buildEmployeeMobileConfig = (
  actions: EmployeeColumnActions,
): DataListMobileConfig<Employee> => ({
  renderTitle: formatEmployeeName,
  renderSubtitle: formatEmployeeJobTitle,
  renderStatus: renderEmployeeStatus,
  renderDetails: (employee) => `${getEmployeeEmail(employee)} • ${getEmployeeRoleName(employee)}`,
  renderActions: (employee) => (
    <RowActionsMenu
      actions={[
        { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(employee) },
        { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(employee) },
      ]}
    />
  ),
});
