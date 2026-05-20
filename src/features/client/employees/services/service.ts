import { employeeEndpoints } from './endpoints';
import type {
  EmployeeCreatePayload,
  EmployeeCreateResponse,
  EmployeeDetailsResponse,
  EmployeeListParams,
  EmployeeListResponse,
  EmployeeUpdatePayload,
  EmployeeUpdateResponse,
} from './types';

export const employeeService = {
  async list(params: EmployeeListParams): Promise<EmployeeListResponse> {
    const { data } = await employeeEndpoints.list(params);
    return data;
  },

  async getById(id: string): Promise<EmployeeDetailsResponse> {
    const { data } = await employeeEndpoints.getById(id);
    return data;
  },

  async create(payload: EmployeeCreatePayload): Promise<EmployeeCreateResponse> {
    const { data } = await employeeEndpoints.create(payload);
    return data;
  },

  async update(id: string, payload: EmployeeUpdatePayload): Promise<EmployeeUpdateResponse> {
    const { data } = await employeeEndpoints.update(id, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await employeeEndpoints.remove(id);
  },
};
