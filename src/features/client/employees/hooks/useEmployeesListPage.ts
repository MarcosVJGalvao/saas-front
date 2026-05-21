import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getLocationStateSearch } from '@shared/utils/getLocationStateSearch';
import {
  buildEmployeeColumns,
  buildEmployeeMobileConfig,
} from '@features/client/employees/components/employeeListColumns';
import { useEmployeesList } from '@features/client/employees/hooks/useEmployeesList';
import type { EmployeeQueryParams } from '@features/client/employees/types/employee.types';
import type { EmployeeStatusValue } from '@shared/i18n/pt-BR/enums';

type EmployeeFilterValues = {
  search: string;
  status: string;
};

const initialFilterValues: EmployeeFilterValues = {
  search: '',
  status: '',
};

const isEmployeeStatus = (value: string): value is EmployeeStatusValue =>
  value === 'active' || value === 'inactive' || value === 'terminated';

const getOptionalText = (value: string): string | undefined => {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const buildQueryFromFilters = (
  filterValues: EmployeeFilterValues,
): Partial<EmployeeQueryParams> => ({
  page: 1,
  search: getOptionalText(filterValues.search),
  status: isEmployeeStatus(filterValues.status) ? filterValues.status : undefined,
});

export const useEmployeesListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialSearch = getLocationStateSearch(location.state);
  const employeesList = useEmployeesList(initialSearch ? { search: initialSearch } : undefined);
  const [filterValues, setFilterValues] = useState<EmployeeFilterValues>({
    ...initialFilterValues,
    search: initialSearch ?? '',
  });

  const tableColumns = buildEmployeeColumns({
    onDetails: (employee) => {
      void navigate(`/client/employees/${employee.id}`);
    },
    onEdit: (employee) => {
      void navigate(`/client/employees/${employee.id}/edit`, { state: { entity: employee } });
    },
  });

  const mobileConfig = buildEmployeeMobileConfig({
    onDetails: (employee) => {
      void navigate(`/client/employees/${employee.id}`);
    },
    onEdit: (employee) => {
      void navigate(`/client/employees/${employee.id}/edit`, { state: { entity: employee } });
    },
  });

  return {
    employeesList,
    tableColumns,
    mobileConfig,
    filterValues,
    onFilterChange: (filterKey: keyof EmployeeFilterValues, filterValue: string) =>
      setFilterValues((currentValues) => ({ ...currentValues, [filterKey]: filterValue })),
    applyFilters: () => employeesList.updateQueryParams(buildQueryFromFilters(filterValues)),
    clearFilters: () => {
      setFilterValues(initialFilterValues);
      employeesList.updateQueryParams({
        page: 1,
        search: undefined,
        status: undefined,
      });
    },
  };
};
