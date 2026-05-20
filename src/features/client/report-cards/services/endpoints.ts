import { httpClient } from '@shared/services/httpClient';
import type {
  ReportCardAcademicPeriodCreatePayload,
  ReportCardAcademicPeriodCreateResponse,
  ReportCardAcademicPeriodDetailsResponse,
  ReportCardAcademicPeriodListParams,
  ReportCardAcademicPeriodListResponse,
  ReportCardBulkEntryDeleteResponse,
  ReportCardBulkEntryPayload,
  ReportCardBulkEntryResponse,
  ReportCardEntryDeleteResponse,
  ReportCardEntryPayload,
  ReportCardEntryResponse,
  ReportCardGenericResponse,
  ReportCardGradeSubjectCreatePayload,
  ReportCardGradeSubjectCreateResponse,
  ReportCardGradeSubjectDetailsResponse,
  ReportCardGradeSubjectListParams,
  ReportCardGradeSubjectListResponse,
  ReportCardQuery,
} from './types';

const REPORT_CARD_BASE_PATH = '/api/report-cards';

export const reportCardEndpoints = {
  listAcademicPeriods: (params: ReportCardAcademicPeriodListParams) =>
    httpClient.get<ReportCardAcademicPeriodListResponse>(
      `${REPORT_CARD_BASE_PATH}/academic-periods`,
      { params },
    ),
  getAcademicPeriodById: (id: string) =>
    httpClient.get<ReportCardAcademicPeriodDetailsResponse>(
      `${REPORT_CARD_BASE_PATH}/academic-periods/${id}`,
    ),
  createAcademicPeriod: (payload: ReportCardAcademicPeriodCreatePayload) =>
    httpClient.post<ReportCardAcademicPeriodCreateResponse>(
      `${REPORT_CARD_BASE_PATH}/academic-periods`,
      payload,
    ),
  listGradeSubjects: (params: ReportCardGradeSubjectListParams) =>
    httpClient.get<ReportCardGradeSubjectListResponse>(`${REPORT_CARD_BASE_PATH}/grade-subjects`, {
      params,
    }),
  getGradeSubjectById: (id: string) =>
    httpClient.get<ReportCardGradeSubjectDetailsResponse>(
      `${REPORT_CARD_BASE_PATH}/grade-subjects/${id}`,
    ),
  createGradeSubject: (payload: ReportCardGradeSubjectCreatePayload) =>
    httpClient.post<ReportCardGradeSubjectCreateResponse>(
      `${REPORT_CARD_BASE_PATH}/grade-subjects`,
      payload,
    ),
  createEntry: (payload: ReportCardEntryPayload) =>
    httpClient.post<ReportCardEntryResponse>(`${REPORT_CARD_BASE_PATH}/entries`, payload),
  updateEntry: (id: string, payload: ReportCardEntryPayload) =>
    httpClient.patch<ReportCardEntryResponse>(`${REPORT_CARD_BASE_PATH}/entries/${id}`, payload),
  createClassEntriesBulk: (schoolClassId: string, payload: ReportCardBulkEntryPayload) =>
    httpClient.post<ReportCardBulkEntryResponse>(
      `${REPORT_CARD_BASE_PATH}/classes/${schoolClassId}/entries/bulk`,
      payload,
    ),
  updateClassEntriesBulk: (schoolClassId: string, payload: ReportCardBulkEntryPayload) =>
    httpClient.patch<ReportCardBulkEntryResponse>(
      `${REPORT_CARD_BASE_PATH}/classes/${schoolClassId}/entries/bulk`,
      payload,
    ),
  removeEntry: (id: string) =>
    httpClient.delete<ReportCardEntryDeleteResponse>(`${REPORT_CARD_BASE_PATH}/entries/${id}`),
  removeClassEntriesBulk: (schoolClassId: string, payload: ReportCardBulkEntryPayload) =>
    httpClient.delete<ReportCardBulkEntryDeleteResponse>(
      `${REPORT_CARD_BASE_PATH}/classes/${schoolClassId}/entries/bulk`,
      {
        data: payload,
      },
    ),
  getStudentReportCard: (studentId: string, params: ReportCardQuery) =>
    httpClient.get<ReportCardGenericResponse>(`${REPORT_CARD_BASE_PATH}/students/${studentId}`, {
      params,
    }),
  getClassReportCard: (schoolClassId: string, params: ReportCardQuery) =>
    httpClient.get<ReportCardGenericResponse>(`${REPORT_CARD_BASE_PATH}/classes/${schoolClassId}`, {
      params,
    }),
  getClassSummary: (schoolClassId: string, params: ReportCardQuery) =>
    httpClient.get<ReportCardGenericResponse>(
      `${REPORT_CARD_BASE_PATH}/classes/${schoolClassId}/summary`,
      { params },
    ),
  getDashboardSummary: (params: ReportCardQuery) =>
    httpClient.get<ReportCardGenericResponse>(`${REPORT_CARD_BASE_PATH}/dashboard/summary`, {
      params,
    }),
  getDashboardCharts: (params: ReportCardQuery) =>
    httpClient.get<ReportCardGenericResponse>(`${REPORT_CARD_BASE_PATH}/dashboard/charts`, {
      params,
    }),
  getProcessing: (id: string) =>
    httpClient.get<ReportCardGenericResponse>(`${REPORT_CARD_BASE_PATH}/processings/${id}`),
  resendProcessingStudent: (id: string, studentEnrollmentId: string) =>
    httpClient.post<ReportCardGenericResponse>(
      `${REPORT_CARD_BASE_PATH}/processings/${id}/resend/students/${studentEnrollmentId}`,
    ),
  resendFailedProcessing: (id: string) =>
    httpClient.post<ReportCardGenericResponse>(
      `${REPORT_CARD_BASE_PATH}/processings/${id}/resend-failed`,
    ),
  finalizePeriod: (schoolClassId: string, academicPeriodId: string) =>
    httpClient.post<ReportCardGenericResponse>(
      `${REPORT_CARD_BASE_PATH}/classes/${schoolClassId}/periods/${academicPeriodId}/finalize`,
    ),
  reopenPeriod: (schoolClassId: string, academicPeriodId: string) =>
    httpClient.post<ReportCardGenericResponse>(
      `${REPORT_CARD_BASE_PATH}/classes/${schoolClassId}/periods/${academicPeriodId}/reopen`,
    ),
};
