import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import {
  buildFinancialRecordsMobileConfig,
  buildFinancialRecordsTableColumns,
} from '@features/client/financial/components/financialRecordsPresentation';
import { useFinancialRecordsList } from '@features/client/financial/hooks/useFinancialRecordsList';
import type {
  FinancialRecord,
  FinancialRecordPayload,
  FinancialRecordQueryParams,
  FinancialRecordStatus,
} from '@features/client/financial/types/financial.types';

type FinancialRecordFilterValues = Record<string, unknown>;

type FinancialRecordsPageMode = 'payable' | 'receivable';

type FinancialRecordsService = {
  list: (params: FinancialRecordQueryParams) => Promise<{
    data: FinancialRecord[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }>;
  pay?: ((id: string, payload: FinancialRecordPayload) => Promise<FinancialRecord>) | undefined;
  receive?: ((id: string, payload: FinancialRecordPayload) => Promise<FinancialRecord>) | undefined;
  cancel: (id: string) => Promise<FinancialRecord>;
};

type FinancialRecordAction = 'settle' | 'cancel';

type FinancialRecordsPageViewModelParams = {
  mode: FinancialRecordsPageMode;
  routeBase: string;
  service: FinancialRecordsService;
  errorMessageFallback: string;
};

const initialFilterValues: FinancialRecordFilterValues = {
  query: '',
  status: '',
  categoryId: '',
  costCenterId: '',
  studentId: '',
  startDate: '',
  endDate: '',
};

const isFinancialRecordStatus = (value: string): value is FinancialRecordStatus =>
  value === 'open' ||
  value === 'partially_paid' ||
  value === 'paid' ||
  value === 'received' ||
  value === 'overdue' ||
  value === 'cancelled' ||
  value === 'reversed';

const getStringValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const getOptionalString = (value: unknown): string | undefined => {
  const stringValue = getStringValue(value);
  return stringValue.length > 0 ? stringValue : undefined;
};

const getOptionalStatus = (value: unknown): FinancialRecordStatus | undefined => {
  const stringValue = getStringValue(value);
  return isFinancialRecordStatus(stringValue) ? stringValue : undefined;
};

const buildQueryFromFilters = (
  filterValues: FinancialRecordFilterValues,
): Partial<FinancialRecordQueryParams> => ({
  search: getOptionalString(filterValues.query),
  status: getOptionalStatus(filterValues.status),
  categoryId: getOptionalString(filterValues.categoryId),
  costCenterId: getOptionalString(filterValues.costCenterId),
  studentId: getOptionalString(filterValues.studentId),
  startDate: getOptionalString(filterValues.startDate),
  endDate: getOptionalString(filterValues.endDate),
  page: 1,
});

export const useFinancialRecordsPageViewModel = ({
  mode,
  routeBase,
  service,
  errorMessageFallback,
}: FinancialRecordsPageViewModelParams) => {
  const navigate = useNavigate();
  const list = useFinancialRecordsList(service, errorMessageFallback);
  const [filterValues, setFilterValues] =
    useState<FinancialRecordFilterValues>(initialFilterValues);
  const [selectedAction, setSelectedAction] = useState<FinancialRecordAction | undefined>(
    undefined,
  );
  const [selectedRecordId, setSelectedRecordId] = useState<string | undefined>(undefined);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | undefined>(undefined);

  const selectedRecord = useMemo(
    () => list.rows.find((row) => row.id === selectedRecordId),
    [list.rows, selectedRecordId],
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
      status: undefined,
      categoryId: undefined,
      costCenterId: undefined,
      studentId: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  const openAction = useCallback((recordId: string, action: FinancialRecordAction): void => {
    setSelectedRecordId(recordId);
    setSelectedAction(action);
    setActionErrorMessage(undefined);
  }, []);

  const closeAction = useCallback((): void => {
    setSelectedRecordId(undefined);
    setSelectedAction(undefined);
  }, []);

  const confirmAction = async (): Promise<void> => {
    if (!selectedRecordId || !selectedAction) return;
    setActionLoading(true);
    setActionErrorMessage(undefined);

    try {
      if (selectedAction === 'cancel') {
        await service.cancel(selectedRecordId);
      } else if (mode === 'payable' && service.pay) {
        await service.pay(selectedRecordId, {});
      } else if (mode === 'receivable' && service.receive) {
        await service.receive(selectedRecordId, {});
      }
      closeAction();
      await list.reload();
    } catch {
      setActionErrorMessage(
        selectedAction === 'cancel'
          ? 'Não foi possível cancelar o registro financeiro.'
          : 'Não foi possível confirmar a baixa financeira.',
      );
    } finally {
      setActionLoading(false);
    }
  };

  const buildRowActions = useCallback(
    (row: FinancialRecord): RowActionItem[] => [
      {
        key: 'details',
        label: 'Ver detalhes',
        onClick: () => void navigate(`${routeBase}/${row.id}`),
      },
      {
        key: 'settle',
        label: mode === 'payable' ? 'Pagar' : 'Receber',
        onClick: () => openAction(row.id, 'settle'),
      },
      {
        key: 'cancel',
        label: 'Cancelar',
        onClick: () => openAction(row.id, 'cancel'),
      },
    ],
    [mode, navigate, openAction, routeBase],
  );

  const selectedDescription = selectedRecord?.description ?? selectedRecord?.name ?? 'selecionado';

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
    columns: buildFinancialRecordsTableColumns({
      buildRowActions,
      showStudent: mode === 'receivable',
    }),
    mobileConfig: buildFinancialRecordsMobileConfig({
      buildRowActions,
      showStudent: mode === 'receivable',
    }),
    actionDialogOpen: selectedAction !== undefined,
    actionDialogTitle:
      selectedAction === 'cancel'
        ? 'Cancelar registro financeiro'
        : mode === 'payable'
          ? 'Confirmar pagamento'
          : 'Confirmar recebimento',
    actionDialogDescription:
      selectedAction === 'cancel'
        ? `Confirma o cancelamento do registro ${selectedDescription}?`
        : `Confirma a baixa do registro ${selectedDescription}?`,
    actionDialogConfirmLabel:
      selectedAction === 'cancel' ? 'Cancelar registro' : mode === 'payable' ? 'Pagar' : 'Receber',
    closeAction,
    confirmAction,
  };
};
