import { legalGuardianEndpoints, studentEndpoints } from './endpoints';
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

export const studentService = {
  async list(params: StudentsListParams): Promise<StudentsListResponse> {
    const { data } = await studentEndpoints.list(params);
    return data;
  },
  async getById(id: string): Promise<StudentDetailsResponse> {
    const { data } = await studentEndpoints.getById(id);
    return data;
  },
  async create(payload: StudentCreatePayload): Promise<StudentCreateResponse> {
    const { data } = await studentEndpoints.create(payload);
    return data;
  },
  async update(id: string, payload: StudentUpdatePayload): Promise<StudentUpdateResponse> {
    const { data } = await studentEndpoints.update(id, payload);
    return data;
  },
  async remove(id: string): Promise<void> {
    await studentEndpoints.remove(id);
  },
  async getFinancialHistory(
    id: string,
    params: StudentFinancialHistoryParams,
  ): Promise<StudentFinancialHistoryResponse> {
    const { data } = await studentEndpoints.getFinancialHistory(id, params);
    return data;
  },
  async downloadEnrollmentCertificate(id: string): Promise<Blob> {
    const { data } = await studentEndpoints.downloadEnrollmentCertificate(id);
    return data;
  },
  async downloadAttendanceCertificate(id: string, payload: StudentCreatePayload): Promise<Blob> {
    const { data } = await studentEndpoints.downloadAttendanceCertificate(id, payload);
    return data;
  },
  async downloadSchoolHistory(id: string): Promise<Blob> {
    const { data } = await studentEndpoints.downloadSchoolHistory(id);
    return data;
  },
};

export const legalGuardianService = {
  async list(params: LegalGuardiansListParams): Promise<LegalGuardiansListResponse> {
    const { data } = await legalGuardianEndpoints.list(params);
    return data;
  },
  async getById(id: string): Promise<LegalGuardianDetailsResponse> {
    const { data } = await legalGuardianEndpoints.getById(id);
    return data;
  },
  async create(payload: LegalGuardianCreatePayload): Promise<LegalGuardianCreateResponse> {
    const { data } = await legalGuardianEndpoints.create(payload);
    return data;
  },
  async update(
    id: string,
    payload: LegalGuardianUpdatePayload,
  ): Promise<LegalGuardianUpdateResponse> {
    const { data } = await legalGuardianEndpoints.update(id, payload);
    return data;
  },
  async remove(id: string): Promise<void> {
    await legalGuardianEndpoints.remove(id);
  },
};
