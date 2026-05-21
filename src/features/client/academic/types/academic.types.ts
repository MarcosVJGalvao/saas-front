import type {
  AcademicYearStatusValue,
  ActiveInactiveStatus,
  ReportCardCalculationTypeValue,
  ReportCardFinalStatusStrategyValue,
  ReportCardRecoveryStrategyValue,
  SchoolClassShiftValue,
  SchoolClassStatusValue,
} from '@shared/i18n/pt-BR/enums';
import type { ClientBaseQueryParams } from '@features/client/shared/types/clientApi.types';

export type AcademicYearStatus = AcademicYearStatusValue;
export type AcademicPeriodStatus = ActiveInactiveStatus;

export type AcademicPeriod = {
  id: string;
  name: string;
  code?: string | undefined;
  sequence?: number | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  weight?: number | undefined;
  isFinalPeriod?: boolean | number | undefined;
  status?: AcademicPeriodStatus | undefined;
};

export type ReportCardPolicy = {
  id?: string | undefined;
  calculationType: ReportCardCalculationTypeValue;
  passingGrade: number;
  minimumAttendancePercentage: number;
  recoveryStrategy: ReportCardRecoveryStrategyValue;
  finalStatusStrategy: ReportCardFinalStatusStrategyValue;
};

export type AcademicYearPeriodInput = {
  name: string;
  code: string;
  sequence: number;
  startDate: string;
  endDate: string;
  weight?: number | undefined;
  isFinalPeriod?: boolean | undefined;
};

export type AcademicYearReportCardPolicyInput = {
  calculationType: ReportCardCalculationTypeValue;
  passingGrade: number;
  minimumAttendancePercentage: number;
  recoveryStrategy: ReportCardRecoveryStrategyValue;
  finalStatusStrategy: ReportCardFinalStatusStrategyValue;
};

export type AcademicYearUpsertPayload = {
  name: string;
  startDate: string;
  endDate: string;
  isClosed?: boolean | undefined;
  academicPeriods: AcademicYearPeriodInput[];
  reportCardPolicy: AcademicYearReportCardPolicyInput;
};

export type AcademicYear = {
  id: string;
  name: string;
  code?: string | undefined;
  status: AcademicYearStatus;
  startDate?: string | undefined;
  endDate?: string | undefined;
  isClosed?: boolean | number | undefined;
  academicPeriods?: AcademicPeriod[] | undefined;
  reportCardPolicy?: ReportCardPolicy | null | undefined;
  description?: string | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type AcademicYearQueryParams = ClientBaseQueryParams & {
  status?: AcademicYearStatus | undefined;
  code?: string | undefined;
};

export type AcademicCatalogItem = {
  id: string;
  name: string;
  code?: string | undefined;
  description?: string | undefined;
  status?: 'active' | 'inactive' | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
  educationLevel?: {
    id: string;
    name: string;
  } | null;
};

export type AcademicCatalogQueryParams = ClientBaseQueryParams & {
  code?: string | undefined;
  status?: 'active' | 'inactive' | undefined;
};

export type SchoolClassStatus = SchoolClassStatusValue;
export type SchoolClassShift = SchoolClassShiftValue;

export type SchoolClass = {
  id: string;
  name: string;
  code?: string | undefined;
  status: SchoolClassStatus;
  shift?: SchoolClassShift | undefined;
  capacity?: number | undefined;
  currentStudents?: number | undefined;
  academicYear?: {
    id: string;
    name: string;
  } | null;
  grade?: {
    id: string;
    name: string;
  } | null;
  educationLevel?: {
    id: string;
    name: string;
  } | null;
  description?: string | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type SchoolClassQueryParams = ClientBaseQueryParams & {
  status?: SchoolClassStatus | undefined;
  shift?: SchoolClassShift | undefined;
  code?: string | undefined;
  academicYearId?: string | undefined;
  gradeId?: string | undefined;
};

export type SchoolClassSummary = {
  id: string;
  name: string;
  studentsTotal?: number | undefined;
  capacity?: number | undefined;
  teacherSubjectsTotal?: number | undefined;
  attendanceSchedulesTotal?: number | undefined;
};

export type TeacherSubject = {
  id: string;
  teacher?: {
    id: string;
    name?: string | undefined;
    person?: {
      fullName?: string | undefined;
    } | null;
  } | null;
  subject?: {
    id: string;
    name: string;
    code?: string | undefined;
  } | null;
  status?: 'active' | 'inactive' | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type TeacherSubjectQueryParams = ClientBaseQueryParams & {
  teacherId?: string | undefined;
  subjectId?: string | undefined;
  status?: 'active' | 'inactive' | undefined;
};
