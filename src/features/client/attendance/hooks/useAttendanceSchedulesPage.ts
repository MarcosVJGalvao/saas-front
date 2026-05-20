import {
  buildAttendanceQueryFromFilters,
  useAttendanceFilters,
} from '@features/client/attendance/hooks/useAttendanceFilters';
import { useAttendanceSchedulesList } from '@features/client/attendance/hooks/useAttendanceSchedulesList';
import {
  attendanceScheduleListColumns,
  attendanceScheduleMobileConfig,
} from '@features/client/attendance/components/attendanceScheduleListColumns';

export const useAttendanceSchedulesPage = () => {
  const attendanceSchedulesList = useAttendanceSchedulesList();
  const filters = useAttendanceFilters();

  return {
    attendanceSchedulesList,
    filterValues: filters.filterValues,
    onFilterChange: filters.onFilterChange,
    applyFilters: () => {
      attendanceSchedulesList.updateQuery(buildAttendanceQueryFromFilters(filters.filterValues));
    },
    clearFilters: () => {
      filters.resetFilters();
      attendanceSchedulesList.updateQuery({
        page: 1,
        schoolClassId: undefined,
        subjectId: undefined,
        studentId: undefined,
        status: undefined,
        startDate: undefined,
        endDate: undefined,
      });
    },
    tableColumns: attendanceScheduleListColumns,
    mobileConfig: attendanceScheduleMobileConfig,
  };
};
