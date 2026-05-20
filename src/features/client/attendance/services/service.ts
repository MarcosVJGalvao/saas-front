import { attendanceEndpoints } from './endpoints';
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

export const attendanceSchedulesService = {
  async create(
    payload: AttendanceScheduleCreateRequest,
  ): Promise<AttendanceScheduleCreateResponse> {
    const { data } = await attendanceEndpoints.createSchedule(payload);
    return data;
  },
  async list(params: AttendanceSchedulesListParams): Promise<AttendanceSchedulesListResponse> {
    const { data } = await attendanceEndpoints.listSchedules({
      ...params,
      sortOrder: params.sortOrder ?? 'DESC',
    });
    return data;
  },
};

export const attendanceRecordsService = {
  async create(payload: AttendanceRecordsCreateRequest): Promise<AttendanceRecordsCreateResponse> {
    const { data } = await attendanceEndpoints.createRecord(payload);
    return data;
  },
};

export const attendanceSummariesService = {
  async list(params: AttendanceSummariesListParams): Promise<AttendanceSummariesListResponse> {
    const { data } = await attendanceEndpoints.listSummaries({
      ...params,
      sortOrder: params.sortOrder ?? 'DESC',
    });
    return data;
  },
};
