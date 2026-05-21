import { studentEnrollmentEndpoints } from './endpoints';
import type {
  StudentEnrollmentContractDownloadResponse,
  StudentEnrollmentCreatePayload,
  StudentEnrollmentCreateResponse,
  StudentEnrollmentDetailsResponse,
  StudentEnrollmentListParams,
  StudentEnrollmentListServiceResponse,
  StudentEnrollmentUpdatePayload,
  StudentEnrollmentUpdateResponse,
} from './types';

export const studentEnrollmentService = {
  async list(params: StudentEnrollmentListParams): Promise<StudentEnrollmentListServiceResponse> {
    const { data } = await studentEnrollmentEndpoints.list(params);
    return data;
  },

  async getById(id: string): Promise<StudentEnrollmentDetailsResponse> {
    const { data } = await studentEnrollmentEndpoints.getById(id);
    return data;
  },

  async create(payload: StudentEnrollmentCreatePayload): Promise<StudentEnrollmentCreateResponse> {
    const { data } = await studentEnrollmentEndpoints.create(payload);
    return data;
  },

  async update(
    id: string,
    payload: StudentEnrollmentUpdatePayload,
  ): Promise<StudentEnrollmentUpdateResponse> {
    const { data } = await studentEnrollmentEndpoints.update(id, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await studentEnrollmentEndpoints.remove(id);
  },

  async downloadEnrollmentContract(id: string): Promise<StudentEnrollmentContractDownloadResponse> {
    const { data } = await studentEnrollmentEndpoints.downloadEnrollmentContract(id);
    return data;
  },
};
