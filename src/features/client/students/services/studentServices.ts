import { httpClient } from '@shared/services/httpClient';
import { createClientCrudService } from '@features/client/shared/services/createClientCrudService';
import type {
  ClientApiRecord,
  ClientBaseQueryParams,
} from '@features/client/shared/types/clientApi.types';
import type {
  LegalGuardian,
  LegalGuardianQueryParams,
  Student,
  StudentQueryParams,
} from '@features/client/students/types/student.types';

type StudentPayload = ClientApiRecord;
type StudentQuery = ClientBaseQueryParams & ClientApiRecord;

export const studentsService = {
  ...createClientCrudService<Student, Student, StudentPayload, StudentPayload, StudentQueryParams>(
    '/api/students',
  ),
  async getFinancialHistory(id: string, params: StudentQuery): Promise<ClientApiRecord> {
    const { data } = await httpClient.get<ClientApiRecord>(
      `/api/students/${id}/financial-history`,
      {
        params,
      },
    );
    return data;
  },
  async downloadEnrollmentCertificate(id: string): Promise<Blob> {
    const { data } = await httpClient.post<Blob>(
      `/api/students/${id}/documents/enrollment-certificate`,
      undefined,
      { responseType: 'blob' },
    );
    return data;
  },
  async downloadAttendanceCertificate(id: string, payload: StudentPayload): Promise<Blob> {
    const { data } = await httpClient.post<Blob>(
      `/api/students/${id}/documents/attendance-certificate`,
      payload,
      { responseType: 'blob' },
    );
    return data;
  },
  async downloadSchoolHistory(id: string): Promise<Blob> {
    const { data } = await httpClient.post<Blob>(
      `/api/students/${id}/documents/school-history`,
      undefined,
      { responseType: 'blob' },
    );
    return data;
  },
};

export const legalGuardianService = createClientCrudService<
  LegalGuardian,
  LegalGuardian,
  StudentPayload,
  StudentPayload,
  LegalGuardianQueryParams
>('/api/legal-guardians');

export const medicalInfoService = createClientCrudService<
  ClientApiRecord,
  ClientApiRecord,
  StudentPayload,
  StudentPayload,
  StudentQuery
>('/api/medical-info');
