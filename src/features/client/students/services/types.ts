import type { PaginatedResponse } from '@shared/types/pagination';
import type {
  LegalGuardian,
  LegalGuardianQueryParams,
  LegalGuardianRequest,
  Student,
  StudentFinancialHistoryQueryParams,
  StudentQueryParams,
  StudentRequest,
} from '../types/student.types';

export type StudentsListParams = StudentQueryParams;
export type StudentsListResponse = PaginatedResponse<Student>;
export type StudentDetailsResponse = Student;
export type StudentCreatePayload = StudentRequest;
export type StudentCreateResponse = Student;
export type StudentUpdatePayload = StudentRequest;
export type StudentUpdateResponse = Student;

export type LegalGuardiansListParams = LegalGuardianQueryParams;
export type LegalGuardiansListResponse = PaginatedResponse<LegalGuardian>;
export type LegalGuardianDetailsResponse = LegalGuardian;
export type LegalGuardianCreatePayload = LegalGuardianRequest;
export type LegalGuardianCreateResponse = LegalGuardian;
export type LegalGuardianUpdatePayload = LegalGuardianRequest;
export type LegalGuardianUpdateResponse = LegalGuardian;

export type StudentFinancialHistoryParams = StudentFinancialHistoryQueryParams;
export type StudentFinancialHistoryResponse = Record<string, unknown>;
