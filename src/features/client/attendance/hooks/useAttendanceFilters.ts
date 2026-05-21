import { useState } from 'react';
import type {
  AttendanceQueryParams,
  AttendanceStatus,
} from '@features/client/attendance/types/attendance.types';

type AttendanceFilterValues = Record<string, unknown>;

export const initialAttendanceFilterValues: AttendanceFilterValues = {
  academicYearId: '',
  schoolClassId: '',
  subjectId: '',
  studentId: '',
  status: '',
  startDate: '',
  endDate: '',
};

const isAttendanceStatus = (value: string): value is AttendanceStatus =>
  value === 'present' || value === 'absent' || value === 'justified';

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const getOptionalString = (value: unknown): string | undefined => {
  const stringValue = getStringValue(value);
  return stringValue.length > 0 ? stringValue : undefined;
};

const getOptionalStatus = (value: unknown): AttendanceStatus | undefined => {
  const stringValue = getStringValue(value);
  return isAttendanceStatus(stringValue) ? stringValue : undefined;
};

export const buildAttendanceQueryFromFilters = (
  filterValues: AttendanceFilterValues,
): Partial<AttendanceQueryParams> => ({
  academicYearId: getOptionalString(filterValues.academicYearId),
  schoolClassId: getOptionalString(filterValues.schoolClassId),
  subjectId: getOptionalString(filterValues.subjectId),
  studentId: getOptionalString(filterValues.studentId),
  status: getOptionalStatus(filterValues.status),
  startDate: getOptionalString(filterValues.startDate),
  endDate: getOptionalString(filterValues.endDate),
  page: 1,
});

export const useAttendanceFilters = () => {
  const [filterValues, setFilterValues] = useState<AttendanceFilterValues>(
    initialAttendanceFilterValues,
  );

  const onFilterChange = (name: string, value: unknown): void => {
    setFilterValues((currentValues) => ({ ...currentValues, [name]: value ?? '' }));
  };

  const resetFilters = (): void => {
    setFilterValues(initialAttendanceFilterValues);
  };

  return {
    filterValues,
    onFilterChange,
    resetFilters,
  };
};
