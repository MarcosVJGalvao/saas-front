import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  buildStudentListColumns,
  buildStudentMobileConfig,
} from '../components/studentListColumns';
import { useStudentsList } from './useStudentsList';
import type { Student, StudentQueryParams, StudentStatus } from '../types/student.types';

type StudentFilterValues = {
  query: string;
  status: string;
};

const initialFilterValues: StudentFilterValues = {
  query: '',
  status: '',
};

const isStudentStatus = (value: string): value is StudentStatus =>
  value === 'active' || value === 'inactive' || value === 'cancelled';

const getOptionalString = (value: string): string | undefined => {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const getOptionalStatus = (value: string): StudentStatus | undefined =>
  isStudentStatus(value) ? value : undefined;

const buildQueryFromFilters = (filterValues: StudentFilterValues): Partial<StudentQueryParams> => ({
  search: getOptionalString(filterValues.query),
  status: getOptionalStatus(filterValues.status),
  page: 1,
});

export const useStudentsListPage = () => {
  const navigate = useNavigate();
  const studentsList = useStudentsList();
  const [filterValues, setFilterValues] = useState<StudentFilterValues>(initialFilterValues);

  return {
    studentsList,
    filterValues,
    onFilterChange: (filterKey: string, filterValue: unknown) => {
      setFilterValues((current) => ({
        ...current,
        [filterKey]: typeof filterValue === 'string' ? filterValue : '',
      }));
    },
    applyFilters: () => {
      studentsList.updateQueryParams(buildQueryFromFilters(filterValues));
    },
    clearFilters: () => {
      setFilterValues(initialFilterValues);
      studentsList.updateQueryParams({
        page: 1,
        search: undefined,
        status: undefined,
      });
    },
    onQueryChange: (search: string) => studentsList.updateQueryParams({ search, page: 1 }),
    onPageChange: (page: number) => studentsList.updateQueryParams({ page }),
    onRowsPerPageChange: (limit: number) => studentsList.updateQueryParams({ limit, page: 1 }),
    tableColumns: buildStudentListColumns({
      onDetails: (student: Student) => {
        void navigate(`/client/students/${student.id}`);
      },
      onEdit: (student: Student) => {
        void navigate(`/client/students/${student.id}/edit`, { state: { entity: student } });
      },
      onNewEnrollment: () => {
        void navigate('/client/student-enrollments/new');
      },
    }),
    mobileConfig: buildStudentMobileConfig({
      onDetails: (student: Student) => {
        void navigate(`/client/students/${student.id}`);
      },
      onEdit: (student: Student) => {
        void navigate(`/client/students/${student.id}/edit`, { state: { entity: student } });
      },
      onNewEnrollment: () => {
        void navigate('/client/student-enrollments/new');
      },
    }),
  };
};
