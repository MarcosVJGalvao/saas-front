import type { PaginatedResponse } from '@shared/types/pagination';
import type {
  StudentListItem,
  Student,
  StudentFinancialHistoryQueryParams,
  StudentQueryParams,
  StudentRequest,
} from '../types/student.types';

export type StudentsListParams = StudentQueryParams;
export type StudentsListResponse = PaginatedResponse<StudentListItem>;
export type StudentDetailsResponse = Student;
export type StudentCreatePayload = StudentRequest;
export type StudentCreateResponse = Student;
export type StudentUpdatePayload = StudentRequest;
export type StudentUpdateResponse = Student;

export type StudentFinancialHistoryParams = StudentFinancialHistoryQueryParams;
export type StudentFinancialHistoryResponse = Record<string, unknown>;
