import { studentEnrollmentEndpoints } from '@features/client/student-enrollments/services/studentEnrollmentEndpoints';
import type {
  CreateStudentEnrollmentRequest,
  StudentEnrollment,
  StudentEnrollmentListResponse,
  StudentEnrollmentQueryParams,
} from '@features/client/student-enrollments/types/studentEnrollment.types';

export const studentEnrollmentService = {
  async list(params: StudentEnrollmentQueryParams): Promise<StudentEnrollmentListResponse> {
    const { data } = await studentEnrollmentEndpoints.list(params);
    return data;
  },

  async getById(id: string): Promise<StudentEnrollment> {
    const { data } = await studentEnrollmentEndpoints.getById(id);
    return data;
  },

  async create(payload: CreateStudentEnrollmentRequest): Promise<StudentEnrollment> {
    const { data } = await studentEnrollmentEndpoints.create(payload);
    return data;
  },

  async update(
    id: string,
    payload: Partial<CreateStudentEnrollmentRequest>,
  ): Promise<StudentEnrollment> {
    const { data } = await studentEnrollmentEndpoints.update(id, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await studentEnrollmentEndpoints.remove(id);
  },

  async downloadEnrollmentContract(id: string): Promise<Blob> {
    const { data } = await studentEnrollmentEndpoints.downloadEnrollmentContract(id);
    return data;
  },
};
