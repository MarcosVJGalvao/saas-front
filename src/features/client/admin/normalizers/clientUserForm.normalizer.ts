import type { AppSelectOption } from '@shared/components/inputs/AppSelect';
import type { ClientUserCreateFormValues } from '@features/client/admin/schemas/clientUserCreateForm.schema';
import type { ClientUserEditFormValues } from '@features/client/admin/schemas/clientUserEditForm.schema';
import type {
  ClientUser,
  ClientUserCreatePayload,
  ClientUserUpdatePayload,
} from '@features/client/admin/types/admin.types';
import type { Employee, EmployeeContact } from '@features/client/employees/types/employee.types';

const toOptionalText = (value: string): string | undefined => {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : undefined;
};

const isEmailContact = (contact: EmployeeContact): boolean => contact.type === 'email';

const findEmployeeEmailContact = (employee: Employee): EmployeeContact | undefined =>
  employee.person?.contacts?.find(isEmailContact) ?? employee.contacts?.find(isEmailContact);

export const getEmployeeContactEmail = (employee: Employee): string | undefined =>
  findEmployeeEmailContact(employee)?.value.trim() || undefined;

const getEmployeeDisplayName = (employee: Employee): string =>
  employee.person?.fullName?.trim() || 'Funcionario sem nome';

export const toEmployeeSelectOption = (employee: Employee): AppSelectOption => {
  const employeeEmail = getEmployeeContactEmail(employee);
  const employeeName = getEmployeeDisplayName(employee);

  return {
    value: employee.id,
    label: employeeEmail ? `${employeeName} - ${employeeEmail}` : employeeName,
  };
};

export const toClientUserCreatePayload = (
  values: ClientUserCreateFormValues,
): ClientUserCreatePayload => ({
  employeeId: values.employeeId.trim(),
  email: values.email.trim(),
  roleId: values.roleId.trim(),
  password: values.password.trim(),
});

export const toClientUserEditFormValues = (user: ClientUser): ClientUserEditFormValues => ({
  email: user.email ?? '',
  roleId: user.role?.id ?? '',
  status: user.status ?? 'active',
});

export const toClientUserUpdatePayload = (
  values: ClientUserEditFormValues,
): ClientUserUpdatePayload => ({
  email: toOptionalText(values.email),
  roleId: values.roleId.trim() ? values.roleId.trim() : null,
  status: values.status,
});
