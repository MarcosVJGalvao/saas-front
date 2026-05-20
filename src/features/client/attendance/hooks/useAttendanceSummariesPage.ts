import {
  buildAttendanceQueryFromFilters,
  useAttendanceFilters,
} from '@features/client/attendance/hooks/useAttendanceFilters';
import { useAttendanceSummariesList } from '@features/client/attendance/hooks/useAttendanceSummariesList';
import {
  attendanceSummaryListColumns,
  attendanceSummaryMobileConfig,
} from '@features/client/attendance/components/attendanceSummaryListColumns';

export const useAttendanceSummariesPage = () => {
  const attendanceSummariesList = useAttendanceSummariesList();
  const filters = useAttendanceFilters();

  return {
    attendanceSummariesList,
    filterValues: filters.filterValues,
    onFilterChange: filters.onFilterChange,
    applyFilters: () => {
      attendanceSummariesList.updateQuery(buildAttendanceQueryFromFilters(filters.filterValues));
    },
    clearFilters: () => {
      filters.resetFilters();
      attendanceSummariesList.updateQuery({
        page: 1,
        schoolClassId: undefined,
        subjectId: undefined,
        studentId: undefined,
        status: undefined,
        startDate: undefined,
        endDate: undefined,
      });
    },
    tableColumns: attendanceSummaryListColumns,
    mobileConfig: attendanceSummaryMobileConfig,
  };
};
