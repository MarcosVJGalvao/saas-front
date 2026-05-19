import type { AttendanceStatusValue } from '@shared/i18n/pt-BR/enums';
import type { ClientBaseQueryParams } from '@features/client/shared/types/clientApi.types';

export type AttendanceStatus = AttendanceStatusValue;

export type AttendanceSchedule = {
  id: string;
  weekday?: string | undefined;
  startTime?: string | undefined;
  endTime?: string | undefined;
  schoolClass?: {
    id: string;
    name: string;
    code?: string | undefined;
  } | null;
  subject?: {
    id: string;
    name: string;
    code?: string | undefined;
  } | null;
  teacher?: {
    id: string;
    name?: string | undefined;
    person?: {
      fullName?: string | undefined;
    } | null;
  } | null;
  academicYear?: {
    id: string;
    name: string;
  } | null;
  createdAt?: string | undefined;
};

export type AttendanceSummary = {
  id: string;
  student?: {
    id: string;
    registrationCode?: string | undefined;
    person?: {
      fullName?: string | undefined;
      documentNumber?: string | undefined;
    } | null;
  } | null;
  schoolClass?: {
    id: string;
    name: string;
  } | null;
  subject?: {
    id: string;
    name: string;
  } | null;
  presentTotal?: number | undefined;
  absentTotal?: number | undefined;
  justifiedTotal?: number | undefined;
  attendancePercentage?: number | undefined;
  status?: AttendanceStatus | undefined;
};

export type AttendanceQueryParams = ClientBaseQueryParams & {
  academicYearId?: string | undefined;
  schoolClassId?: string | undefined;
  subjectId?: string | undefined;
  teacherId?: string | undefined;
  studentId?: string | undefined;
  date?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  status?: AttendanceStatus | undefined;
};

export type MarkAttendancePayload = {
  scheduleId: string;
  attendanceDate: string;
  items: Array<{
    studentEnrollmentId: string;
    status: AttendanceStatus;
    observations?: string | undefined;
  }>;
};
