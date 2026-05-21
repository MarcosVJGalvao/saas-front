import {
  buildAttendanceQueryFromFilters,
  useAttendanceFilters,
} from '@features/client/attendance/hooks/useAttendanceFilters';
import { useAttendanceSummariesList } from '@features/client/attendance/hooks/useAttendanceSummariesList';
import {
  attendanceSummaryListColumns,
  attendanceSummaryMobileConfig,
} from '@features/client/attendance/components/attendanceSummaryListColumns';
import { useAttendanceReferenceOptions } from '@features/client/attendance/hooks/useAttendanceReferenceOptions';

export const useAttendanceSummariesPage = () => {
  const attendanceSummariesList = useAttendanceSummariesList();
  const filters = useAttendanceFilters();
  const referenceOptions = useAttendanceReferenceOptions({ includeStudents: true });

  return {
    attendanceSummariesList,
    referenceOptions,
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
