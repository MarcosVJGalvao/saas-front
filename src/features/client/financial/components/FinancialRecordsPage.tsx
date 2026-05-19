import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import type { FilterField } from '@shared/components/data-display/data/listFilters.types';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useFinancialRecordsPageViewModel } from '@features/client/financial/hooks/useFinancialRecordsPageViewModel';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';
import type {
  FinancialRecord,
  FinancialRecordPayload,
  FinancialRecordQueryParams,
} from '@features/client/financial/types/financial.types';

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

type FinancialRecordsPageProps = {
  mode: FinancialRecordsPageMode;
  title: string;
  subtitle: string;
  routeBase: string;
  service: FinancialRecordsService;
  errorMessageFallback: string;
  emptyTitle: string;
  emptyDescription: string;
  createPermission: string;
};

const baseFilterFields: FilterField[] = [
  {
    type: 'text',
    name: 'query',
    label: 'Buscar',
    placeholder: 'Descrição',
    mobileOrder: 1,
  },
  {
    type: 'select',
    name: 'status',
    label: 'Status',
    placeholder: 'Todos os status',
    options: [
      { value: 'open', label: 'Aberto' },
      { value: 'partially_paid', label: 'Parcialmente pago' },
      { value: 'paid', label: 'Pago' },
      { value: 'received', label: 'Recebido' },
      { value: 'overdue', label: 'Em atraso' },
      { value: 'cancelled', label: 'Cancelado' },
      { value: 'reversed', label: 'Estornado' },
    ],
    mobileOrder: 2,
  },
  {
    type: 'text',
    name: 'categoryId',
    label: 'Categoria',
    placeholder: 'ID da categoria',
    mobileOrder: 3,
  },
  {
    type: 'text',
    name: 'costCenterId',
    label: 'Centro de custo',
    placeholder: 'ID do centro',
    mobileOrder: 4,
  },
  {
    type: 'text',
    name: 'paymentMethod',
    label: 'Método de pagamento',
    placeholder: 'pix, cash, credit_card...',
    mobileOrder: 5,
  },
  {
    type: 'dateRange',
    name: 'period',
    label: 'Período',
    startName: 'startDate',
    endName: 'endDate',
    mobileOrder: 9,
  },
];

const studentFilterField: FilterField = {
  type: 'text',
  name: 'studentId',
  label: 'Aluno',
  placeholder: 'ID do aluno',
  mobileOrder: 6,
};

const studentEnrollmentFilterField: FilterField = {
  type: 'text',
  name: 'studentEnrollmentId',
  label: 'Matrícula',
  placeholder: 'ID da matrícula',
  mobileOrder: 7,
};

const schoolClassFilterField: FilterField = {
  type: 'text',
  name: 'schoolClassId',
  label: 'Turma',
  placeholder: 'ID da turma',
  mobileOrder: 8,
};

export const FinancialRecordsPage = ({
  mode,
  title,
  subtitle,
  routeBase,
  service,
  errorMessageFallback,
  emptyTitle,
  emptyDescription,
  createPermission,
}: FinancialRecordsPageProps) => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const model = useFinancialRecordsPageViewModel({
    mode,
    routeBase,
    service,
    errorMessageFallback,
  });

  const filterFields =
    mode === 'receivable'
      ? [
          ...baseFilterFields,
          studentFilterField,
          studentEnrollmentFilterField,
          schoolClassFilterField,
        ]
      : baseFilterFields;

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actionLabel="Cadastrar"
        canShowAction={permissions.can(createPermission)}
        onAction={() => void navigate(`${routeBase}/new`)}
      />
      <ListFilters
        fields={filterFields}
        values={model.filterValues}
        onChange={model.onFilterChange}
        onApply={model.applyFilters}
        onClear={model.clearFilters}
        loading={model.list.loading || model.actionLoading}
      />
      {model.actionErrorMessage ? (
        <AppText color="error">{model.actionErrorMessage}</AppText>
      ) : null}
      <QueryDataTable
        rows={model.list.rows}
        columns={model.columns}
        mobileConfig={model.mobileConfig}
        meta={model.list.meta}
        loading={model.list.loading}
        errorMessage={model.list.errorMessage}
        onRetry={() => {
          void model.list.reload();
        }}
        query={model.query}
        onQueryChange={model.onQueryChange}
        onPageChange={model.onPageChange}
        onRowsPerPageChange={model.onLimitChange}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        toolbarContent={
          <AppText color="text.secondary">
            Use filtros para consultar status, categoria, centro de custo, método e período.
          </AppText>
        }
        hideToolbar
      />
      <ConfirmDialog
        open={model.actionDialogOpen}
        title={model.actionDialogTitle}
        description={model.actionDialogDescription}
        confirmLabel={model.actionDialogConfirmLabel}
        onCancel={model.closeAction}
        onConfirm={() => {
          void model.confirmAction();
        }}
      />
    </AppStack>
  );
};
