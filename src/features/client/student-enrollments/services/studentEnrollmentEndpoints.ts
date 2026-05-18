import { httpClient } from '@shared/services/httpClient';
import type {
  CreateStudentEnrollmentRequest,
  StudentEnrollment,
  StudentEnrollmentListResponse,
  StudentEnrollmentQueryParams,
} from '@features/client/student-enrollments/types/studentEnrollment.types';

const STUDENT_ENROLLMENTS_BASE_PATH = '/api/student-enrollments';

export const studentEnrollmentEndpoints = {
  list: (params: StudentEnrollmentQueryParams) =>
    httpClient.get<StudentEnrollmentListResponse>(STUDENT_ENROLLMENTS_BASE_PATH, {
      params: { ...params, sortOrder: params.sortOrder ?? 'DESC' },
    }),

  getById: (id: string) =>
    httpClient.get<StudentEnrollment>(`${STUDENT_ENROLLMENTS_BASE_PATH}/${id}`),

  create: (payload: CreateStudentEnrollmentRequest) =>
    httpClient.post<StudentEnrollment>(STUDENT_ENROLLMENTS_BASE_PATH, payload),

  update: (id: string, payload: Partial<CreateStudentEnrollmentRequest>) =>
    httpClient.patch<StudentEnrollment>(`${STUDENT_ENROLLMENTS_BASE_PATH}/${id}`, payload),

  remove: (id: string) => httpClient.delete<void>(`${STUDENT_ENROLLMENTS_BASE_PATH}/${id}`),

  downloadEnrollmentContract: (id: string) =>
    httpClient.post<Blob>(`${STUDENT_ENROLLMENTS_BASE_PATH}/${id}/enrollment-contract`, undefined, {
      responseType: 'blob',
    }),
};
