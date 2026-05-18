import { httpClient } from '@shared/services/httpClient';
import type { ClientApiRecord } from '@features/client/shared/types/clientApi.types';
import type { PaginatedResponse } from '@shared/types/pagination';
import type {
  AttendanceQueryParams,
  AttendanceSchedule,
  AttendanceSummary,
  MarkAttendancePayload,
} from '@features/client/attendance/types/attendance.types';

export const attendanceService = {
  async createSchedule(payload: ClientApiRecord): Promise<ClientApiRecord> {
    const { data } = await httpClient.post<ClientApiRecord>('/api/attendance/schedules', payload);
    return data;
  },
  async listSchedules(
    params: AttendanceQueryParams,
  ): Promise<PaginatedResponse<AttendanceSchedule>> {
    const { data } = await httpClient.get<PaginatedResponse<AttendanceSchedule>>(
      '/api/attendance/schedules',
      {
        params: { ...params, sortOrder: params.sortOrder ?? 'DESC' },
      },
    );
    return data;
  },
  async markAttendance(payload: MarkAttendancePayload): Promise<ClientApiRecord> {
    const { data } = await httpClient.post<ClientApiRecord>('/api/attendance/records', payload);
    return data;
  },
  async listSummaries(
    params: AttendanceQueryParams,
  ): Promise<PaginatedResponse<AttendanceSummary>> {
    const { data } = await httpClient.get<PaginatedResponse<AttendanceSummary>>(
      '/api/attendance/summaries',
      {
        params: { ...params, sortOrder: params.sortOrder ?? 'DESC' },
      },
    );
    return data;
  },
};
