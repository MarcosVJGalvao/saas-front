import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  attendanceRecordsService,
  attendanceSchedulesService,
  attendanceSummariesService,
} from '@features/client/attendance/services/service';
import { httpClient } from '@shared/services/httpClient';

describe('attendance services', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lista horários de frequência com filtros', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        data: [{ id: 'schedule-1', weekday: 'Segunda-feira' }],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    });

    const response = await attendanceSchedulesService.list({
      page: 1,
      limit: 10,
      schoolClassId: 'class-1',
    });

    expect(getSpy).toHaveBeenCalledWith('/api/attendance/schedules', {
      params: { page: 1, limit: 10, schoolClassId: 'class-1', sortOrder: 'DESC' },
    });
    expect(response.data[0]?.id).toBe('schedule-1');
  });

  it('marca frequência com payload tipado', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
      data: { id: 'record-1' },
    });

    const response = await attendanceRecordsService.create({
      scheduleId: 'schedule-1',
      attendanceDate: '2026-05-18',
      items: [{ studentEnrollmentId: 'enrollment-1', status: 'present' }],
    });

    expect(postSpy).toHaveBeenCalledWith('/api/attendance/records', {
      scheduleId: 'schedule-1',
      attendanceDate: '2026-05-18',
      items: [{ studentEnrollmentId: 'enrollment-1', status: 'present' }],
    });
    expect(response.id).toBe('record-1');
  });

  it('lista resumos de frequência', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        data: [{ id: 'summary-1', presentTotal: 10 }],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    });

    const response = await attendanceSummariesService.list({
      page: 1,
      limit: 10,
      status: 'present',
    });

    expect(getSpy).toHaveBeenCalledWith('/api/attendance/summaries', {
      params: { page: 1, limit: 10, status: 'present', sortOrder: 'DESC' },
    });
    expect(response.data[0]?.presentTotal).toBe(10);
  });
});
