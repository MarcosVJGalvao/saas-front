import { httpClient } from '@shared/services/httpClient';
import type {
  EmployeeCreatePayload,
  EmployeeCreateResponse,
  EmployeeDeleteResponse,
  EmployeeDetailsResponse,
  EmployeeListParams,
  EmployeeListResponse,
  EmployeeUpdatePayload,
  EmployeeUpdateResponse,
} from './types';

const EMPLOYEES_BASE_PATH = '/api/employees';

export const employeeEndpoints = {
  list: (params: EmployeeListParams) =>
    httpClient.get<EmployeeListResponse>(EMPLOYEES_BASE_PATH, {
      params: { ...params, sortOrder: params.sortOrder ?? 'DESC' },
    }),
  getById: (id: string) => httpClient.get<EmployeeDetailsResponse>(`${EMPLOYEES_BASE_PATH}/${id}`),
  create: (payload: EmployeeCreatePayload) =>
    httpClient.post<EmployeeCreateResponse>(EMPLOYEES_BASE_PATH, payload),
  update: (id: string, payload: EmployeeUpdatePayload) =>
    httpClient.patch<EmployeeUpdateResponse>(`${EMPLOYEES_BASE_PATH}/${id}`, payload),
  remove: (id: string) => httpClient.delete<EmployeeDeleteResponse>(`${EMPLOYEES_BASE_PATH}/${id}`),
};
