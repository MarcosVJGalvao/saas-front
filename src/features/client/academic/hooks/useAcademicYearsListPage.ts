import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getLocationStateSearch } from '@shared/utils/getLocationStateSearch';
import {
  buildAcademicYearColumns,
  buildAcademicYearMobileConfig,
} from '@features/client/academic/components/academicYearListColumns';
import { academicYearService } from '@features/client/academic/services/service';
import { useAcademicYearsList } from '@features/client/academic/hooks/useAcademicYearsList';
import type {
  AcademicYear,
  AcademicYearQueryParams,
  AcademicYearStatus,
} from '@features/client/academic/types/academic.types';

type AcademicYearFilterValues = {
  query: string;
  code: string;
  status: string;
};

type AcademicYearAction = 'close' | 'reopen';

const initialFilterValues: AcademicYearFilterValues = {
  query: '',
  code: '',
  status: '',
};

const isAcademicYearStatus = (value: string): value is AcademicYearStatus =>
  value === 'scheduled' || value === 'active' || value === 'closed';

const getOptionalString = (value: string): string | undefined => {
  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : undefined;
};

const getOptionalStatus = (value: string): AcademicYearStatus | undefined =>
  isAcademicYearStatus(value) ? value : undefined;

const buildQueryFromFilters = (
  filterValues: AcademicYearFilterValues,
): Partial<AcademicYearQueryParams> => ({
  search: getOptionalString(filterValues.query),
  code: getOptionalString(filterValues.code),
  status: getOptionalStatus(filterValues.status),
  page: 1,
});

export const useAcademicYearsListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialSearch = getLocationStateSearch(location.state);
  const academicYearsList = useAcademicYearsList(
    initialSearch ? { search: initialSearch } : undefined,
  );
  const [filterValues, setFilterValues] = useState<AcademicYearFilterValues>({
    ...initialFilterValues,
    query: initialSearch ?? '',
  });
  const [actionType, setActionType] = useState<AcademicYearAction | undefined>();
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYear | undefined>();
  const [actionLoading, setActionLoading] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | undefined>();

  const requestAction = (nextActionType: AcademicYearAction, academicYear: AcademicYear) => {
    setActionType(nextActionType);
    setSelectedAcademicYear(academicYear);
  };

  const handleActionConfirm = async (): Promise<void> => {
    if (!actionType || !selectedAcademicYear) {
      return;
    }
    setActionLoading(true);
    setActionErrorMessage(undefined);
    try {
      if (actionType === 'close') {
        await academicYearService.close(selectedAcademicYear.id);
      } else {
        await academicYearService.reopen(selectedAcademicYear.id);
      }
      setActionType(undefined);
      setSelectedAcademicYear(undefined);
      await academicYearsList.reload();
    } catch {
      setActionErrorMessage('Não foi possível atualizar o ano letivo.');
    } finally {
      setActionLoading(false);
    }
  };

  return {
    academicYearsList,
    actionLoading,
    actionErrorMessage,
    filterValues,
    onFilterChange: (filterKey: string, filterValue: unknown) => {
      const normalizedValue = typeof filterValue === 'string' ? filterValue : '';
      if (filterKey === 'query' || filterKey === 'code' || filterKey === 'status') {
        setFilterValues((currentValues) => ({ ...currentValues, [filterKey]: normalizedValue }));
      }
    },
    applyFilters: () => {
      academicYearsList.updateQuery(buildQueryFromFilters(filterValues));
    },
    clearFilters: () => {
      setFilterValues(initialFilterValues);
      academicYearsList.updateQuery({
        page: 1,
        search: undefined,
        code: undefined,
        status: undefined,
      });
    },
    tableColumns: buildAcademicYearColumns({
      onDetails: (academicYear) => {
        void navigate(`/client/academic-years/${academicYear.id}`);
      },
      onEdit: (academicYear) => {
        void navigate(`/client/academic-years/${academicYear.id}/edit`, {
          state: { entity: academicYear },
        });
      },
      onClose: (academicYear) => requestAction('close', academicYear),
      onReopen: (academicYear) => requestAction('reopen', academicYear),
    }),
    mobileConfig: buildAcademicYearMobileConfig({
      onDetails: (academicYear) => {
        void navigate(`/client/academic-years/${academicYear.id}`);
      },
      onEdit: (academicYear) => {
        void navigate(`/client/academic-years/${academicYear.id}/edit`, {
          state: { entity: academicYear },
        });
      },
      onClose: (academicYear) => requestAction('close', academicYear),
      onReopen: (academicYear) => requestAction('reopen', academicYear),
    }),
    actionDialog: {
      open: actionType !== undefined,
      title: actionType === 'close' ? 'Fechar ano letivo' : 'Reabrir ano letivo',
      description: `Confirma a ação para o ano letivo ${selectedAcademicYear?.name ?? 'selecionado'}?`,
      confirmLabel:
        actionType === 'close'
          ? actionLoading
            ? 'Fechando...'
            : 'Fechar'
          : actionLoading
            ? 'Reabrindo...'
            : 'Reabrir',
      close: () => {
        setActionType(undefined);
        setSelectedAcademicYear(undefined);
      },
      confirm: handleActionConfirm,
    },
  };
};
