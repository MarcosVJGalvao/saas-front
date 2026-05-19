import { createClientCrudService } from '@features/client/shared/services/createClientCrudService';
import type { ClientApiRecord } from '@features/client/shared/types/clientApi.types';
import type {
  Employee,
  EmployeeQueryParams,
} from '@features/client/employees/types/employee.types';

export const employeeService = createClientCrudService<
  Employee,
  Employee,
  ClientApiRecord,
  ClientApiRecord,
  EmployeeQueryParams
>('/api/employees');
