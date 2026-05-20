import { httpClient } from '@shared/services/httpClient';
import type {
  LegalGuardianCreatePayload,
  LegalGuardianCreateResponse,
  LegalGuardianDetailsResponse,
  LegalGuardiansListParams,
  LegalGuardiansListResponse,
  LegalGuardianUpdatePayload,
  LegalGuardianUpdateResponse,
  StudentCreatePayload,
  StudentCreateResponse,
  StudentDetailsResponse,
  StudentFinancialHistoryParams,
  StudentFinancialHistoryResponse,
  StudentsListParams,
  StudentsListResponse,
  StudentUpdatePayload,
  StudentUpdateResponse,
} from './types';

const STUDENTS_BASE_PATH = '/api/students';
const LEGAL_GUARDIANS_BASE_PATH = '/api/legal-guardians';

export const studentEndpoints = {
  list: (params: StudentsListParams) =>
    httpClient.get<StudentsListResponse>(STUDENTS_BASE_PATH, {
      params: { ...params, sortOrder: params.sortOrder ?? 'DESC' },
    }),
  getById: (id: string) => httpClient.get<StudentDetailsResponse>(`${STUDENTS_BASE_PATH}/${id}`),
  create: (payload: StudentCreatePayload) =>
    httpClient.post<StudentCreateResponse>(STUDENTS_BASE_PATH, payload),
  update: (id: string, payload: StudentUpdatePayload) =>
    httpClient.patch<StudentUpdateResponse>(`${STUDENTS_BASE_PATH}/${id}`, payload),
  remove: (id: string) => httpClient.delete<void>(`${STUDENTS_BASE_PATH}/${id}`),
  getFinancialHistory: (id: string, params: StudentFinancialHistoryParams) =>
    httpClient.get<StudentFinancialHistoryResponse>(
      `${STUDENTS_BASE_PATH}/${id}/financial-history`,
      {
        params,
      },
    ),
  downloadEnrollmentCertificate: (id: string) =>
    httpClient.post<Blob>(
      `${STUDENTS_BASE_PATH}/${id}/documents/enrollment-certificate`,
      undefined,
      {
        responseType: 'blob',
      },
    ),
  downloadAttendanceCertificate: (id: string, payload: StudentCreatePayload) =>
    httpClient.post<Blob>(`${STUDENTS_BASE_PATH}/${id}/documents/attendance-certificate`, payload, {
      responseType: 'blob',
    }),
  downloadSchoolHistory: (id: string) =>
    httpClient.post<Blob>(`${STUDENTS_BASE_PATH}/${id}/documents/school-history`, undefined, {
      responseType: 'blob',
    }),
};

export const legalGuardianEndpoints = {
  list: (params: LegalGuardiansListParams) =>
    httpClient.get<LegalGuardiansListResponse>(LEGAL_GUARDIANS_BASE_PATH, {
      params: { ...params, sortOrder: params.sortOrder ?? 'DESC' },
    }),
  getById: (id: string) =>
    httpClient.get<LegalGuardianDetailsResponse>(`${LEGAL_GUARDIANS_BASE_PATH}/${id}`),
  create: (payload: LegalGuardianCreatePayload) =>
    httpClient.post<LegalGuardianCreateResponse>(LEGAL_GUARDIANS_BASE_PATH, payload),
  update: (id: string, payload: LegalGuardianUpdatePayload) =>
    httpClient.patch<LegalGuardianUpdateResponse>(`${LEGAL_GUARDIANS_BASE_PATH}/${id}`, payload),
  remove: (id: string) => httpClient.delete<void>(`${LEGAL_GUARDIANS_BASE_PATH}/${id}`),
};
