import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import {
  buildStudentsMobileConfig,
  buildStudentsTableColumns,
} from '@features/client/students/components/studentsListPresentation';
import { useStudentsList } from '@features/client/students/hooks/useStudentsList';
import type {
  Student,
  StudentQueryParams,
  StudentStatus,
} from '@features/client/students/types/student.types';

type StudentFilterValues = Record<string, unknown>;

const initialFilterValues: StudentFilterValues = {
  query: '',
  status: '',
};

const isStudentStatus = (value: string): value is StudentStatus =>
  value === 'active' || value === 'inactive' || value === 'cancelled';

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const getOptionalString = (value: unknown): string | undefined => {
  const stringValue = getStringValue(value);
  return stringValue.length > 0 ? stringValue : undefined;
};

const getOptionalStatus = (value: unknown): StudentStatus | undefined => {
  const stringValue = getStringValue(value);
  return isStudentStatus(stringValue) ? stringValue : undefined;
};

const buildQueryFromFilters = (filterValues: StudentFilterValues): Partial<StudentQueryParams> => ({
  search: getOptionalString(filterValues.query),
  status: getOptionalStatus(filterValues.status),
  page: 1,
});

export const useStudentsListPageViewModel = () => {
  const navigate = useNavigate();
  const list = useStudentsList();
  const [filterValues, setFilterValues] = useState<StudentFilterValues>(initialFilterValues);

  const onFilterChange = (name: string, value: unknown): void => {
    setFilterValues((currentValues) => ({ ...currentValues, [name]: value ?? '' }));
  };

  const applyFilters = (): void => {
    list.updateQuery(buildQueryFromFilters(filterValues));
  };

  const clearFilters = (): void => {
    setFilterValues(initialFilterValues);
    list.updateQuery({
      page: 1,
      search: undefined,
      status: undefined,
    });
  };

  const buildRowActions = useCallback(
    (row: Student): RowActionItem[] => [
      {
        key: 'details',
        label: 'Ver detalhes',
        onClick: () => void navigate(`/client/students/${row.id}`),
      },
      {
        key: 'edit',
        label: 'Editar',
        onClick: () => void navigate(`/client/students/${row.id}/edit`),
      },
      {
        key: 'new-enrollment',
        label: 'Nova matrícula',
        onClick: () => void navigate('/client/student-enrollments/new'),
      },
    ],
    [navigate],
  );

  return {
    list,
    query: list.query.search ?? '',
    filterValues,
    onFilterChange,
    applyFilters,
    clearFilters,
    onQueryChange: (search: string) => list.updateQuery({ search, page: 1 }),
    onPageChange: (page: number) => list.updateQuery({ page }),
    onLimitChange: (limit: number) => list.updateQuery({ limit, page: 1 }),
    columns: buildStudentsTableColumns({ buildRowActions }),
    mobileConfig: buildStudentsMobileConfig({ buildRowActions }),
  };
};
