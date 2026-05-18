import { httpClient } from '@shared/services/httpClient';
import type {
  ClientApiRecord,
  ClientBaseQueryParams,
} from '@features/client/shared/types/clientApi.types';

type ReportCardQuery = ClientBaseQueryParams & ClientApiRecord;

export const reportCardService = {
  async createAcademicPeriod(payload: ClientApiRecord): Promise<ClientApiRecord> {
    const { data } = await httpClient.post<ClientApiRecord>(
      '/api/report-cards/academic-periods',
      payload,
    );
    return data;
  },
  async listAcademicPeriods(params: ReportCardQuery): Promise<ClientApiRecord> {
    const { data } = await httpClient.get<ClientApiRecord>('/api/report-cards/academic-periods', {
      params,
    });
    return data;
  },
  async createGradeSubject(payload: ClientApiRecord): Promise<ClientApiRecord> {
    const { data } = await httpClient.post<ClientApiRecord>(
      '/api/report-cards/grade-subjects',
      payload,
    );
    return data;
  },
  async listGradeSubjects(params: ReportCardQuery): Promise<ClientApiRecord> {
    const { data } = await httpClient.get<ClientApiRecord>('/api/report-cards/grade-subjects', {
      params,
    });
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
  async removeEntry(id: string): Promise<void> {
    await httpClient.delete(`/api/report-cards/entries/${id}`);
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
  async getProcessing(id: string): Promise<ClientApiRecord> {
    const { data } = await httpClient.get<ClientApiRecord>(`/api/report-cards/processings/${id}`);
    return data;
  },
  async resendFailedProcessing(id: string): Promise<ClientApiRecord> {
    const { data } = await httpClient.post<ClientApiRecord>(
      `/api/report-cards/processings/${id}/resend-failed`,
    );
    return data;
  },
};
