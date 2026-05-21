import type { ClientApiRecord } from '@features/client/shared/types/clientApi.types';
import type {
  Employee,
  EmployeeQueryParams,
} from '@features/client/employees/types/employee.types';
import type { PaginatedResponse } from '@shared/types/pagination';

export type EmployeeListParams = EmployeeQueryParams;
export type EmployeeListResponse = PaginatedResponse<Employee>;
export type EmployeeDetailsResponse = Employee;
export type EmployeeCreatePayload = ClientApiRecord;
export type EmployeeCreateResponse = Employee;
export type EmployeeUpdatePayload = ClientApiRecord;
export type EmployeeUpdateResponse = Employee;
export type EmployeeDeleteResponse = void;
