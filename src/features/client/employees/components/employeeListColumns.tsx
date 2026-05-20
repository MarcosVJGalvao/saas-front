import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { employeeStatusLabels } from '@shared/i18n/pt-BR/enums';
import { maskCnpj, maskCpf } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import type { Employee } from '@features/client/employees/types/employee.types';

export interface EmployeeColumnActions {
  onDetails: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
}

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

const formatEmployeeName = (employee: Employee): string => employee.person?.fullName ?? '-';

export const buildEmployeeColumns = (
  actions: EmployeeColumnActions,
): DataTableColumn<Employee>[] => [
  { key: 'name', header: 'Nome', render: formatEmployeeName },
  { key: 'jobTitle', header: 'Cargo', render: (employee) => employee.jobTitle },
  {
    key: 'department',
    header: 'Departamento',
    render: (employee) => employee.department ?? '-',
  },
  { key: 'documentNumber', header: 'Documento', render: formatEmployeeDocument },
  {
    key: 'status',
    header: 'Status',
    render: (employee) => (employee.status ? employeeStatusLabels[employee.status] : '-'),
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
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
  renderSubtitle: (employee) => employee.jobTitle,
  renderDetails: formatEmployeeDocument,
  renderActions: (employee) => (
    <RowActionsMenu
      actions={[
        { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(employee) },
        { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(employee) },
      ]}
    />
  ),
});
