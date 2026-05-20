import type { ClientApiRecord } from '@features/client/shared/types/clientApi.types';
import type { PaginatedResponse } from '@shared/types/pagination';
import type {
  AcademicCatalogItem,
  AcademicCatalogQueryParams,
  AcademicYear,
  AcademicYearQueryParams,
  SchoolClass,
  SchoolClassQueryParams,
  SchoolClassSummary,
  TeacherSubject,
  TeacherSubjectQueryParams,
} from '@features/client/academic/types/academic.types';

export type AcademicYearListParams = AcademicYearQueryParams;
export type AcademicYearListResponse = PaginatedResponse<AcademicYear>;
export type AcademicYearDetailsResponse = AcademicYear;
export type AcademicYearCreatePayload = ClientApiRecord;
export type AcademicYearCreateResponse = AcademicYear;
export type AcademicYearUpdatePayload = ClientApiRecord;
export type AcademicYearUpdateResponse = AcademicYear;
export type AcademicYearCloseResponse = void;
export type AcademicYearReopenResponse = void;

export type AcademicCatalogListParams = AcademicCatalogQueryParams;
export type AcademicCatalogListResponse = PaginatedResponse<AcademicCatalogItem>;
export type AcademicCatalogDetailsResponse = AcademicCatalogItem;
export type AcademicCatalogCreatePayload = ClientApiRecord;
export type AcademicCatalogCreateResponse = AcademicCatalogItem;
export type AcademicCatalogUpdatePayload = ClientApiRecord;
export type AcademicCatalogUpdateResponse = AcademicCatalogItem;
export type AcademicCatalogDeleteResponse = void;

export type TeacherSubjectListParams = TeacherSubjectQueryParams;
export type TeacherSubjectListResponse = PaginatedResponse<TeacherSubject>;
export type TeacherSubjectDetailsResponse = TeacherSubject;
export type TeacherSubjectCreatePayload = ClientApiRecord;
export type TeacherSubjectCreateResponse = TeacherSubject;
export type TeacherSubjectUpdatePayload = ClientApiRecord;
export type TeacherSubjectUpdateResponse = TeacherSubject;
export type TeacherSubjectDeleteResponse = void;

export type SchoolClassListParams = SchoolClassQueryParams;
export type SchoolClassListResponse = PaginatedResponse<SchoolClass>;
export type SchoolClassDetailsResponse = SchoolClass;
export type SchoolClassCreatePayload = ClientApiRecord;
export type SchoolClassCreateResponse = SchoolClass;
export type SchoolClassUpdatePayload = ClientApiRecord;
export type SchoolClassUpdateResponse = SchoolClass;
export type SchoolClassDeleteResponse = void;
export type SchoolClassSummaryResponse = SchoolClassSummary;
export type SchoolClassAssignStudentsPayload = {
  studentIds: string[];
};
export type SchoolClassAssignTeacherSubjectsPayload = {
  teacherSubjectIds: string[];
};
