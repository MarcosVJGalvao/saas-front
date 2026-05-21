import { reportCardEndpoints } from './endpoints';
import type {
  ReportCardAcademicPeriodCreatePayload,
  ReportCardAcademicPeriodCreateResponse,
  ReportCardAcademicPeriodDetailsResponse,
  ReportCardAcademicPeriodListParams,
  ReportCardAcademicPeriodListResponse,
  ReportCardBulkEntryPayload,
  ReportCardBulkEntryResponse,
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

export const reportCardService = {
  async createAcademicPeriod(
    payload: ReportCardAcademicPeriodCreatePayload,
  ): Promise<ReportCardAcademicPeriodCreateResponse> {
    const { data } = await reportCardEndpoints.createAcademicPeriod(payload);
    return data;
  },
  async listAcademicPeriods(
    params: ReportCardAcademicPeriodListParams,
  ): Promise<ReportCardAcademicPeriodListResponse> {
    const { data } = await reportCardEndpoints.listAcademicPeriods(params);
    return data;
  },
  async getAcademicPeriodById(id: string): Promise<ReportCardAcademicPeriodDetailsResponse> {
    const { data } = await reportCardEndpoints.getAcademicPeriodById(id);
    return data;
  },
  async createGradeSubject(
    payload: ReportCardGradeSubjectCreatePayload,
  ): Promise<ReportCardGradeSubjectCreateResponse> {
    const { data } = await reportCardEndpoints.createGradeSubject(payload);
    return data;
  },
  async listGradeSubjects(
    params: ReportCardGradeSubjectListParams,
  ): Promise<ReportCardGradeSubjectListResponse> {
    const { data } = await reportCardEndpoints.listGradeSubjects(params);
    return data;
  },
  async getGradeSubjectById(id: string): Promise<ReportCardGradeSubjectDetailsResponse> {
    const { data } = await reportCardEndpoints.getGradeSubjectById(id);
    return data;
  },
  async createEntry(payload: ReportCardEntryPayload): Promise<ReportCardEntryResponse> {
    const { data } = await reportCardEndpoints.createEntry(payload);
    return data;
  },
  async updateEntry(id: string, payload: ReportCardEntryPayload): Promise<ReportCardEntryResponse> {
    const { data } = await reportCardEndpoints.updateEntry(id, payload);
    return data;
  },
  async createClassEntriesBulk(
    schoolClassId: string,
    payload: ReportCardBulkEntryPayload,
  ): Promise<ReportCardBulkEntryResponse> {
    const { data } = await reportCardEndpoints.createClassEntriesBulk(schoolClassId, payload);
    return data;
  },
  async updateClassEntriesBulk(
    schoolClassId: string,
    payload: ReportCardBulkEntryPayload,
  ): Promise<ReportCardBulkEntryResponse> {
    const { data } = await reportCardEndpoints.updateClassEntriesBulk(schoolClassId, payload);
    return data;
  },
  async removeEntry(id: string): Promise<void> {
    await reportCardEndpoints.removeEntry(id);
  },
  async removeClassEntriesBulk(
    schoolClassId: string,
    payload: ReportCardBulkEntryPayload,
  ): Promise<void> {
    await reportCardEndpoints.removeClassEntriesBulk(schoolClassId, payload);
  },
  async getStudentReportCard(
    studentId: string,
    params: ReportCardQuery,
  ): Promise<ReportCardGenericResponse> {
    const { data } = await reportCardEndpoints.getStudentReportCard(studentId, params);
    return data;
  },
  async getClassReportCard(
    schoolClassId: string,
    params: ReportCardQuery,
  ): Promise<ReportCardGenericResponse> {
    const { data } = await reportCardEndpoints.getClassReportCard(schoolClassId, params);
    return data;
  },
  async getClassSummary(
    schoolClassId: string,
    params: ReportCardQuery,
  ): Promise<ReportCardGenericResponse> {
    const { data } = await reportCardEndpoints.getClassSummary(schoolClassId, params);
    return data;
  },
  async getDashboardSummary(params: ReportCardQuery): Promise<ReportCardGenericResponse> {
    const { data } = await reportCardEndpoints.getDashboardSummary(params);
    return data;
  },
  async getDashboardCharts(params: ReportCardQuery): Promise<ReportCardGenericResponse> {
    const { data } = await reportCardEndpoints.getDashboardCharts(params);
    return data;
  },
  async getProcessing(id: string): Promise<ReportCardGenericResponse> {
    const { data } = await reportCardEndpoints.getProcessing(id);
    return data;
  },
  async resendProcessingStudent(
    id: string,
    studentEnrollmentId: string,
  ): Promise<ReportCardGenericResponse> {
    const { data } = await reportCardEndpoints.resendProcessingStudent(id, studentEnrollmentId);
    return data;
  },
  async resendFailedProcessing(id: string): Promise<ReportCardGenericResponse> {
    const { data } = await reportCardEndpoints.resendFailedProcessing(id);
    return data;
  },
  async finalizePeriod(
    schoolClassId: string,
    academicPeriodId: string,
  ): Promise<ReportCardGenericResponse> {
    const { data } = await reportCardEndpoints.finalizePeriod(schoolClassId, academicPeriodId);
    return data;
  },
  async reopenPeriod(
    schoolClassId: string,
    academicPeriodId: string,
  ): Promise<ReportCardGenericResponse> {
    const { data } = await reportCardEndpoints.reopenPeriod(schoolClassId, academicPeriodId);
    return data;
  },
};
