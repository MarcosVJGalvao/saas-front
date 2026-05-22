import type { ClientBaseQueryParams } from '@features/client/shared/types/clientApi.types';

export type ReportCardAcademicPeriod = {
  id: string;
  name: string;
  code?: string | undefined;
  sequence?: number | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  weight?: number | undefined;
  isFinalPeriod?: boolean | number | undefined;
  status?: 'open' | 'closed' | 'active' | 'inactive' | undefined;
  academicYear?: {
    id: string;
    name: string;
    startDate?: string | undefined;
    endDate?: string | undefined;
    status?: 'open' | 'closed' | 'active' | 'inactive' | undefined;
    isClosed?: boolean | number | undefined;
  } | null;
};

export type ReportCardGradeSubject = {
  id: string;
  workload?: number | undefined;
  order?: number | undefined;
  required?: boolean | undefined;
  grade?: {
    id: string;
    name: string;
  } | null;
  subjects?:
    | {
        id: string;
        name: string;
      }[]
    | null;
  academicYear?: {
    id: string;
    name: string;
  } | null;
};

export type ReportCardCatalogEntity = ReportCardAcademicPeriod | ReportCardGradeSubject;

export type ReportCardQueryParams = ClientBaseQueryParams & {
  academicYearId?: string | undefined;
  gradeId?: string | undefined;
  subjectId?: string | undefined;
};

export type ReportCardPayload = Record<string, unknown>;
