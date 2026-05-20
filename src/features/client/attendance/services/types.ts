import type { ClientApiRecord } from '@features/client/shared/types/clientApi.types';
import type { PaginatedResponse } from '@shared/types/pagination';
import type {
  AttendanceQueryParams,
  AttendanceRecordCreatePayload,
  AttendanceSchedule,
  AttendanceScheduleCreatePayload,
  AttendanceSummary,
} from '@features/client/attendance/types/attendance.types';

export type AttendanceSchedulesListParams = AttendanceQueryParams;
export type AttendanceSchedulesListResponse = PaginatedResponse<AttendanceSchedule>;
export type AttendanceScheduleCreateRequest = AttendanceScheduleCreatePayload;
export type AttendanceScheduleCreateResponse = ClientApiRecord;

export type AttendanceRecordsCreateRequest = AttendanceRecordCreatePayload;
export type AttendanceRecordsCreateResponse = ClientApiRecord;

export type AttendanceSummariesListParams = AttendanceQueryParams;
export type AttendanceSummariesListResponse = PaginatedResponse<AttendanceSummary>;
