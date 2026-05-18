import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import {
  buildAcademicYearsMobileConfig,
  buildAcademicYearsTableColumns,
} from '@features/client/academic/components/academicYearsListPresentation';
import { academicYearService } from '@features/client/academic/services/academicServices';
import { useAcademicYearsList } from '@features/client/academic/hooks/useAcademicYearsList';
import type {
  AcademicYear,
  AcademicYearQueryParams,
  AcademicYearStatus,
} from '@features/client/academic/types/academic.types';

type AcademicYearFilterValues = Record<string, unknown>;
type AcademicYearAction = 'close' | 'reopen';

const initialFilterValues: AcademicYearFilterValues = {
  query: '',
  code: '',
  status: '',
};

const isAcademicYearStatus = (value: string): value is AcademicYearStatus =>
  value === 'scheduled' || value === 'active' || value === 'closed';

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const getOptionalString = (value: unknown): string | undefined => {
  const stringValue = getStringValue(value);
  return stringValue.length > 0 ? stringValue : undefined;
};

const getOptionalStatus = (value: unknown): AcademicYearStatus | undefined => {
  const stringValue = getStringValue(value);
  return isAcademicYearStatus(stringValue) ? stringValue : undefined;
};

const buildQueryFromFilters = (
  filterValues: AcademicYearFilterValues,
): Partial<AcademicYearQueryParams> => ({
  search: getOptionalString(filterValues.query),
  code: getOptionalString(filterValues.code),
  status: getOptionalStatus(filterValues.status),
  page: 1,
});

export const useAcademicYearsListPageViewModel = () => {
  const navigate = useNavigate();
  const list = useAcademicYearsList();
  const [filterValues, setFilterValues] = useState<AcademicYearFilterValues>(initialFilterValues);
  const [selectedAction, setSelectedAction] = useState<AcademicYearAction | undefined>(undefined);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string | undefined>(
    undefined,
  );
  const [actionLoading, setActionLoading] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | undefined>(undefined);

  const selectedAcademicYear = useMemo(
    () => list.rows.find((row) => row.id === selectedAcademicYearId),
    [list.rows, selectedAcademicYearId],
  );

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
      code: undefined,
      status: undefined,
    });
  };

  const requestAction = (action: AcademicYearAction, row: AcademicYear): void => {
    setSelectedAction(action);
    setSelectedAcademicYearId(row.id);
  };

  const closeActionDialog = (): void => {
    setSelectedAction(undefined);
    setSelectedAcademicYearId(undefined);
  };

  const confirmAction = async (): Promise<void> => {
    if (!selectedAction || !selectedAcademicYearId) return;
    setActionLoading(true);
    setActionErrorMessage(undefined);
    try {
      if (selectedAction === 'close') {
        await academicYearService.close(selectedAcademicYearId);
      } else {
        await academicYearService.reopen(selectedAcademicYearId);
      }
      closeActionDialog();
      await list.reload();
    } catch {
      setActionErrorMessage('Não foi possível atualizar o ano letivo.');
    } finally {
      setActionLoading(false);
    }
  };

  const buildRowActions = useCallback(
    (row: AcademicYear): RowActionItem[] => [
      {
        key: 'details',
        label: 'Ver detalhes',
        onClick: () => void navigate(`/client/academic-years/${row.id}`),
      },
      {
        key: 'close',
        label: 'Fechar ano letivo',
        onClick: () => requestAction('close', row),
      },
      {
        key: 'reopen',
        label: 'Reabrir ano letivo',
        onClick: () => requestAction('reopen', row),
      },
    ],
    [navigate],
  );

  return {
    list,
    query: list.query.search ?? '',
    actionLoading,
    actionErrorMessage,
    filterValues,
    onFilterChange,
    applyFilters,
    clearFilters,
    onQueryChange: (search: string) => list.updateQuery({ search, page: 1 }),
    onPageChange: (page: number) => list.updateQuery({ page }),
    onLimitChange: (limit: number) => list.updateQuery({ limit, page: 1 }),
    columns: buildAcademicYearsTableColumns({ buildRowActions }),
    mobileConfig: buildAcademicYearsMobileConfig({ buildRowActions }),
    actionDialogOpen: selectedAction !== undefined,
    actionDialogTitle: selectedAction === 'close' ? 'Fechar ano letivo' : 'Reabrir ano letivo',
    actionDialogDescription: `Confirma a ação para o ano letivo ${selectedAcademicYear?.name ?? 'selecionado'}?`,
    actionConfirmLabel:
      selectedAction === 'close'
        ? actionLoading
          ? 'Fechando...'
          : 'Fechar'
        : actionLoading
          ? 'Reabrindo...'
          : 'Reabrir',
    closeActionDialog,
    confirmAction,
  };
};
