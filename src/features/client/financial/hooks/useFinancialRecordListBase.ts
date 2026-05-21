import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getLocationStateSearch } from '@shared/utils/getLocationStateSearch';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import {
  buildFinancialRecordColumns,
  buildFinancialRecordMobileConfig,
} from '@features/client/financial/components/financialRecordListColumns';
import {
  normalizeAccountsPayableSettlementPayload,
  normalizeAccountsReceivableSettlementPayload,
} from '@features/client/financial/normalizers/financialSettlementNormalizer';
import { useFinancialRecordsList } from '@features/client/financial/hooks/useFinancialRecordsList';
import type {
  FinancialRecord,
  FinancialRecordPayload,
  FinancialRecordQueryParams,
} from '@features/client/financial/types/financial.types';

type FinancialRecordListMode = 'payable' | 'receivable';
type FinancialRecordAction = 'settle' | 'cancel';

type FinancialRecordListService = {
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
  settle: (id: string, payload: FinancialRecordPayload) => Promise<FinancialRecord>;
  cancel: (id: string) => Promise<FinancialRecord>;
};

type FinancialRecordFilterValues = {
  query: string;
  status: string;
  categoryId: string;
  costCenterId: string;
  studentId: string;
  studentEnrollmentId: string;
  schoolClassId: string;
  paymentMethod: string;
  startDate: string;
  endDate: string;
};

type UseFinancialRecordListBaseParams = {
  mode: FinancialRecordListMode;
  routeBase: string;
  service: FinancialRecordListService;
  errorMessageFallback: string;
};

const initialFilterValues: FinancialRecordFilterValues = {
  query: '',
  status: '',
  categoryId: '',
  costCenterId: '',
  studentId: '',
  studentEnrollmentId: '',
  schoolClassId: '',
  paymentMethod: '',
  startDate: '',
  endDate: '',
};

const getOptionalText = (value: string): string | undefined => {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : undefined;
};

const isFinancialRecordStatus = (
  value: string,
): value is
  | 'open'
  | 'partially_paid'
  | 'paid'
  | 'received'
  | 'overdue'
  | 'cancelled'
  | 'reversed' =>
  ['open', 'partially_paid', 'paid', 'received', 'overdue', 'cancelled', 'reversed'].includes(
    value,
  );

export const useFinancialRecordListBase = ({
  mode,
  routeBase,
  service,
  errorMessageFallback,
}: UseFinancialRecordListBaseParams): {
  financialRecordList: ReturnType<typeof useFinancialRecordsList>;
  filterValues: FinancialRecordFilterValues;
  onFilterChange: (fieldName: string, fieldValue: unknown) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  tableColumns: DataTableColumn<FinancialRecord>[];
  mobileConfig: DataListMobileConfig<FinancialRecord>;
  actionDialogOpen: boolean;
  actionDialogTitle: string;
  actionDialogDescription: string;
  actionDialogConfirmLabel: string;
  actionErrorMessage: string | undefined;
  actionLoading: boolean;
  closeAction: () => void;
  confirmAction: () => Promise<void>;
} => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialSearch = getLocationStateSearch(location.state);
  const financialRecordList = useFinancialRecordsList(service, errorMessageFallback);
  const [filterValues, setFilterValues] = useState<FinancialRecordFilterValues>({
    ...initialFilterValues,
    query: initialSearch,
  });
  const [selectedAction, setSelectedAction] = useState<FinancialRecordAction | undefined>();
  const [selectedRecordId, setSelectedRecordId] = useState<string | undefined>();
  const [actionLoading, setActionLoading] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | undefined>();

  const selectedRecord = useMemo(
    () => financialRecordList.rows.find((row) => row.id === selectedRecordId),
    [financialRecordList.rows, selectedRecordId],
  );

  const onFilterChange = (fieldName: string, fieldValue: unknown): void => {
    setFilterValues((currentValues) => ({
      ...currentValues,
      [fieldName]: typeof fieldValue === 'string' ? fieldValue : '',
    }));
  };

  const applyFilters = (): void => {
    financialRecordList.updateQuery({
      search: getOptionalText(filterValues.query),
      status: isFinancialRecordStatus(filterValues.status) ? filterValues.status : undefined,
      categoryId: getOptionalText(filterValues.categoryId),
      costCenterId: getOptionalText(filterValues.costCenterId),
      studentId: getOptionalText(filterValues.studentId),
      studentEnrollmentId: getOptionalText(filterValues.studentEnrollmentId),
      schoolClassId: getOptionalText(filterValues.schoolClassId),
      paymentMethod: getOptionalText(filterValues.paymentMethod),
      startDate: getOptionalText(filterValues.startDate),
      endDate: getOptionalText(filterValues.endDate),
      page: 1,
    });
  };

  const clearFilters = (): void => {
    setFilterValues(initialFilterValues);
    financialRecordList.updateQuery({
      search: undefined,
      status: undefined,
      categoryId: undefined,
      costCenterId: undefined,
      studentId: undefined,
      studentEnrollmentId: undefined,
      schoolClassId: undefined,
      paymentMethod: undefined,
      startDate: undefined,
      endDate: undefined,
      page: 1,
    });
  };

  const openAction = useCallback((record: FinancialRecord, action: FinancialRecordAction) => {
    setSelectedRecordId(record.id);
    setSelectedAction(action);
    setActionErrorMessage(undefined);
  }, []);

  const closeAction = (): void => {
    setSelectedAction(undefined);
    setSelectedRecordId(undefined);
  };

  const confirmAction = async (): Promise<void> => {
    if (!selectedRecordId || !selectedAction) return;
    setActionLoading(true);
    setActionErrorMessage(undefined);
    try {
      if (selectedAction === 'cancel') {
        await service.cancel(selectedRecordId);
      } else {
        await service.settle(
          selectedRecordId,
          mode === 'payable'
            ? normalizeAccountsPayableSettlementPayload(selectedRecord)
            : normalizeAccountsReceivableSettlementPayload(selectedRecord),
        );
      }
      closeAction();
      await financialRecordList.reload();
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

  const actions = {
    onDetails: (record: FinancialRecord) => {
      void navigate(`${routeBase}/${record.id}`);
    },
    onEdit: (record: FinancialRecord) => {
      void navigate(`${routeBase}/${record.id}/edit`, { state: { entity: record } });
    },
    onSettle: (record: FinancialRecord) => {
      openAction(record, 'settle');
    },
    onCancel: (record: FinancialRecord) => {
      openAction(record, 'cancel');
    },
  };

  const selectedDescription = selectedRecord?.description ?? selectedRecord?.name ?? 'selecionado';

  return {
    financialRecordList,
    filterValues,
    onFilterChange,
    applyFilters,
    clearFilters,
    tableColumns: buildFinancialRecordColumns(
      actions,
      mode === 'receivable',
      mode === 'payable' ? 'Pagar' : 'Receber',
    ),
    mobileConfig: buildFinancialRecordMobileConfig(
      actions,
      mode === 'receivable',
      mode === 'payable' ? 'Pagar' : 'Receber',
    ),
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
    actionErrorMessage,
    actionLoading,
    closeAction,
    confirmAction,
  };
};
