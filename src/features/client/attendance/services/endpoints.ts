import { httpClient } from '@shared/services/httpClient';
import type {
  AttendanceRecordsCreateRequest,
  AttendanceRecordsCreateResponse,
  AttendanceScheduleCreateRequest,
  AttendanceScheduleCreateResponse,
  AttendanceSchedulesListParams,
  AttendanceSchedulesListResponse,
  AttendanceSummariesListParams,
  AttendanceSummariesListResponse,
} from './types';

const ATTENDANCE_SCHEDULES_BASE_PATH = '/api/attendance/schedules';
const ATTENDANCE_RECORDS_BASE_PATH = '/api/attendance/records';
const ATTENDANCE_SUMMARIES_BASE_PATH = '/api/attendance/summaries';

export const attendanceEndpoints = {
  createSchedule: (payload: AttendanceScheduleCreateRequest) =>
    httpClient.post<AttendanceScheduleCreateResponse>(ATTENDANCE_SCHEDULES_BASE_PATH, payload),
  listSchedules: (params: AttendanceSchedulesListParams) =>
    httpClient.get<AttendanceSchedulesListResponse>(ATTENDANCE_SCHEDULES_BASE_PATH, {
      params,
    }),
  createRecord: (payload: AttendanceRecordsCreateRequest) =>
    httpClient.post<AttendanceRecordsCreateResponse>(ATTENDANCE_RECORDS_BASE_PATH, payload),
  listSummaries: (params: AttendanceSummariesListParams) =>
    httpClient.get<AttendanceSummariesListResponse>(ATTENDANCE_SUMMARIES_BASE_PATH, {
      params,
    }),
};
