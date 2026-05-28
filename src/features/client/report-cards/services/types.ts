import type {
  ClientApiRecord,
  ClientBaseQueryParams,
} from '@features/client/shared/types/clientApi.types';
import type { PaginatedResponse } from '@shared/types/pagination';
import type {
  ReportCardAcademicPeriod,
  ReportCardGradeSubject,
  ReportCardPayload,
  ReportCardQueryParams,
} from '@features/client/report-cards/types/reportCard.types';

export type ReportCardQuery = ClientBaseQueryParams & ClientApiRecord;

export type ReportCardAcademicPeriodListParams = ReportCardQueryParams;
export type ReportCardAcademicPeriodListResponse = PaginatedResponse<ReportCardAcademicPeriod>;
export type ReportCardAcademicPeriodDetailsResponse = ReportCardAcademicPeriod;
export type ReportCardAcademicPeriodCreatePayload = ReportCardPayload;
export type ReportCardAcademicPeriodCreateResponse = ReportCardAcademicPeriod;

export type ReportCardGradeSubjectListParams = ReportCardQueryParams;
export type ReportCardGradeSubjectListResponse = PaginatedResponse<ReportCardGradeSubject>;
export type ReportCardGradeSubjectDetailsResponse = ReportCardGradeSubject;
export type ReportCardGradeSubjectCreatePayload = ReportCardPayload;
export type ReportCardGradeSubjectCreateResponse = ReportCardGradeSubject;

export type ReportCardEntryPayload = ClientApiRecord;
export type ReportCardEntryResponse = ClientApiRecord;
export type ReportCardEntryDeleteResponse = void;
export type ReportCardBulkEntryPayload = ClientApiRecord;
export type ReportCardBulkEntryResponse = ClientApiRecord;
export type ReportCardBulkEntryDeleteResponse = void;
export type ReportCardGenericResponse = ClientApiRecord;

export type ClassGradeEntryItem = {
  studentEnrollmentId: string;
  gradeValue: number;
  observations?: string;
};

export type ClassGradeEntryPayload = {
  teacherSubjectId: string;
  academicPeriodId: string;
  assessmentType: string;
  entries: ClassGradeEntryItem[];
};

export type ClassGradeEntryResponse = ClientApiRecord;
