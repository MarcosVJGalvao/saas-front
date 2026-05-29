import { httpClient } from '@shared/services/httpClient';
import type {
  StudentEnrollmentContractDownloadResponse,
  StudentEnrollmentCreatePayload,
  StudentEnrollmentCreateResponse,
  StudentEnrollmentDeleteResponse,
  StudentEnrollmentDetailsResponse,
  StudentEnrollmentListParams,
  StudentEnrollmentListServiceResponse,
  StudentEnrollmentUpdatePayload,
  StudentEnrollmentUpdateResponse,
} from './types';

const STUDENT_ENROLLMENTS_BASE_PATH = '/api/student-enrollments';

export const studentEnrollmentEndpoints = {
  list: (params: StudentEnrollmentListParams) =>
    httpClient.get<StudentEnrollmentListServiceResponse>(STUDENT_ENROLLMENTS_BASE_PATH, {
      params: { ...params, sortOrder: params.sortOrder ?? 'DESC' },
    }),

  getById: (id: string) =>
    httpClient.get<StudentEnrollmentDetailsResponse>(`${STUDENT_ENROLLMENTS_BASE_PATH}/${id}`),

  create: (payload: StudentEnrollmentCreatePayload) =>
    httpClient.post<StudentEnrollmentCreateResponse>(STUDENT_ENROLLMENTS_BASE_PATH, payload),

  update: (id: string, payload: StudentEnrollmentUpdatePayload) =>
    httpClient.patch<StudentEnrollmentUpdateResponse>(
      `${STUDENT_ENROLLMENTS_BASE_PATH}/${id}`,
      payload,
    ),

  remove: (id: string) =>
    httpClient.delete<StudentEnrollmentDeleteResponse>(`${STUDENT_ENROLLMENTS_BASE_PATH}/${id}`),

  downloadEnrollmentContract: (id: string) =>
    httpClient.post<StudentEnrollmentContractDownloadResponse>(
      `${STUDENT_ENROLLMENTS_BASE_PATH}/${id}/enrollment-contract`,
      undefined,
      { responseType: 'blob', timeout: 80000 },
    ),
};
