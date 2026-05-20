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
  const studentList = useStudentsList();
  const [filterValues, setFilterValues] = useState<StudentFilterValues>(initialFilterValues);

  return {
    studentList,
    filterValues,
    onFilterChange: (filterKey: string, filterValue: unknown) => {
      setFilterValues((current) => ({
        ...current,
        [filterKey]: typeof filterValue === 'string' ? filterValue : '',
      }));
    },
    applyFilters: () => {
      studentList.updateQuery(buildQueryFromFilters(filterValues));
    },
    clearFilters: () => {
      setFilterValues(initialFilterValues);
      studentList.updateQuery({
        page: 1,
        search: undefined,
        status: undefined,
      });
    },
    onQueryChange: (search: string) => studentList.updateQuery({ search, page: 1 }),
    onPageChange: (page: number) => studentList.updateQuery({ page }),
    onLimitChange: (limit: number) => studentList.updateQuery({ limit, page: 1 }),
    columns: buildStudentListColumns({
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
