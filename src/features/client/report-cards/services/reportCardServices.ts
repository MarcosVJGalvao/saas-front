import { httpClient } from '@shared/services/httpClient';
import type { PaginatedResponse } from '@shared/types/pagination';
import type {
  ClientApiRecord,
  ClientBaseQueryParams,
} from '@features/client/shared/types/clientApi.types';
import type {
  ReportCardAcademicPeriod,
  ReportCardGradeSubject,
  ReportCardPayload,
  ReportCardQueryParams,
} from '@features/client/report-cards/types/reportCard.types';

type ReportCardQuery = ClientBaseQueryParams & ClientApiRecord;

export const reportCardService = {
  async createAcademicPeriod(payload: ReportCardPayload): Promise<ReportCardAcademicPeriod> {
    const { data } = await httpClient.post<ReportCardAcademicPeriod>(
      '/api/report-cards/academic-periods',
      payload,
    );
    return data;
  },
  async listAcademicPeriods(
    params: ReportCardQueryParams,
  ): Promise<PaginatedResponse<ReportCardAcademicPeriod>> {
    const { data } = await httpClient.get<PaginatedResponse<ReportCardAcademicPeriod>>(
      '/api/report-cards/academic-periods',
      { params },
    );
    return data;
  },
  async getAcademicPeriodById(id: string): Promise<ReportCardAcademicPeriod> {
    const { data } = await httpClient.get<ReportCardAcademicPeriod>(
      `/api/report-cards/academic-periods/${id}`,
    );
    return data;
  },
  async createGradeSubject(payload: ReportCardPayload): Promise<ReportCardGradeSubject> {
    const { data } = await httpClient.post<ReportCardGradeSubject>(
      '/api/report-cards/grade-subjects',
      payload,
    );
    return data;
  },
  async listGradeSubjects(
    params: ReportCardQueryParams,
  ): Promise<PaginatedResponse<ReportCardGradeSubject>> {
    const { data } = await httpClient.get<PaginatedResponse<ReportCardGradeSubject>>(
      '/api/report-cards/grade-subjects',
      { params },
    );
    return data;
  },
  async getGradeSubjectById(id: string): Promise<ReportCardGradeSubject> {
    const { data } = await httpClient.get<ReportCardGradeSubject>(
      `/api/report-cards/grade-subjects/${id}`,
    );
    return data;
  },
  async createEntry(payload: ClientApiRecord): Promise<ClientApiRecord> {
    const { data } = await httpClient.post<ClientApiRecord>('/api/report-cards/entries', payload);
    return data;
  },
  async updateEntry(id: string, payload: ClientApiRecord): Promise<ClientApiRecord> {
    const { data } = await httpClient.patch<ClientApiRecord>(
      `/api/report-cards/entries/${id}`,
      payload,
    );
    return data;
  },
  async createClassEntriesBulk(
    schoolClassId: string,
    payload: ClientApiRecord,
  ): Promise<ClientApiRecord> {
    const { data } = await httpClient.post<ClientApiRecord>(
      `/api/report-cards/classes/${schoolClassId}/entries/bulk`,
      payload,
    );
    return data;
  },
  async updateClassEntriesBulk(
    schoolClassId: string,
    payload: ClientApiRecord,
  ): Promise<ClientApiRecord> {
    const { data } = await httpClient.patch<ClientApiRecord>(
      `/api/report-cards/classes/${schoolClassId}/entries/bulk`,
      payload,
    );
    return data;
  },
  async removeEntry(id: string): Promise<void> {
    await httpClient.delete(`/api/report-cards/entries/${id}`);
  },
  async removeClassEntriesBulk(schoolClassId: string, payload: ClientApiRecord): Promise<void> {
    await httpClient.delete(`/api/report-cards/classes/${schoolClassId}/entries/bulk`, {
      data: payload,
    });
  },
  async getStudentReportCard(studentId: string, params: ReportCardQuery): Promise<ClientApiRecord> {
    const { data } = await httpClient.get<ClientApiRecord>(
      `/api/report-cards/students/${studentId}`,
      { params },
    );
    return data;
  },
  async getClassReportCard(
    schoolClassId: string,
    params: ReportCardQuery,
  ): Promise<ClientApiRecord> {
    const { data } = await httpClient.get<ClientApiRecord>(
      `/api/report-cards/classes/${schoolClassId}`,
      { params },
    );
    return data;
  },
  async getClassSummary(schoolClassId: string, params: ReportCardQuery): Promise<ClientApiRecord> {
    const { data } = await httpClient.get<ClientApiRecord>(
      `/api/report-cards/classes/${schoolClassId}/summary`,
      { params },
    );
    return data;
  },
  async getDashboardSummary(params: ReportCardQuery): Promise<ClientApiRecord> {
    const { data } = await httpClient.get<ClientApiRecord>('/api/report-cards/dashboard/summary', {
      params,
    });
    return data;
  },
  async getDashboardCharts(params: ReportCardQuery): Promise<ClientApiRecord> {
    const { data } = await httpClient.get<ClientApiRecord>('/api/report-cards/dashboard/charts', {
      params,
    });
    return data;
  },
  async getProcessing(id: string): Promise<ClientApiRecord> {
    const { data } = await httpClient.get<ClientApiRecord>(`/api/report-cards/processings/${id}`);
    return data;
  },
  async resendProcessingStudent(id: string, studentEnrollmentId: string): Promise<ClientApiRecord> {
    const { data } = await httpClient.post<ClientApiRecord>(
      `/api/report-cards/processings/${id}/resend/students/${studentEnrollmentId}`,
    );
    return data;
  },
  async resendFailedProcessing(id: string): Promise<ClientApiRecord> {
    const { data } = await httpClient.post<ClientApiRecord>(
      `/api/report-cards/processings/${id}/resend-failed`,
    );
    return data;
  },
  async finalizePeriod(schoolClassId: string, academicPeriodId: string): Promise<ClientApiRecord> {
    const { data } = await httpClient.post<ClientApiRecord>(
      `/api/report-cards/classes/${schoolClassId}/periods/${academicPeriodId}/finalize`,
    );
    return data;
  },
  async reopenPeriod(schoolClassId: string, academicPeriodId: string): Promise<ClientApiRecord> {
    const { data } = await httpClient.post<ClientApiRecord>(
      `/api/report-cards/classes/${schoolClassId}/periods/${academicPeriodId}/reopen`,
    );
    return data;
  },
};
