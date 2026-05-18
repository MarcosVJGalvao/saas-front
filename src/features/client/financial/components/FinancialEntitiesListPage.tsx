import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import type { FilterField } from '@shared/components/data-display/data/listFilters.types';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useFinancialEntitiesListPageViewModel } from '@features/client/financial/hooks/useFinancialEntitiesListPageViewModel';
import type {
  FinancialEntity,
  FinancialEntityPayload,
  FinancialEntityQueryParams,
} from '@features/client/financial/types/financial.types';
import type { ClientCrudService } from '@features/client/shared/types/clientApi.types';

type FinancialEntitiesService = Pick<
  ClientCrudService<
    FinancialEntity,
    FinancialEntity,
    FinancialEntityPayload,
    FinancialEntityPayload,
    FinancialEntityQueryParams
  >,
  'list'
>;

type FinancialEntitiesListPageProps = {
  title: string;
  subtitle: string;
  routeBase: string;
  service: FinancialEntitiesService;
  errorMessageFallback: string;
  emptyTitle: string;
  emptyDescription: string;
  showType?: boolean | undefined;
};

export const FinancialEntitiesListPage = ({
  title,
  subtitle,
  routeBase,
  service,
  errorMessageFallback,
  emptyTitle,
  emptyDescription,
  showType = false,
}: FinancialEntitiesListPageProps) => {
  const navigate = useNavigate();
  const model = useFinancialEntitiesListPageViewModel({
    service,
    routeBase,
    errorMessageFallback,
    showType,
  });

  const typeField: FilterField[] = showType
    ? [
        {
          type: 'select',
          name: 'type',
          label: 'Tipo',
          placeholder: 'Todos os tipos',
          options: [
            { value: 'revenue', label: 'Receita' },
            { value: 'expense', label: 'Despesa' },
          ],
          mobileOrder: 4,
        },
      ]
    : [];

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actionLabel="Cadastrar"
        onAction={() => void navigate(`${routeBase}/new`)}
      />
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: 'Nome',
            mobileOrder: 1,
          },
          {
            type: 'text',
            name: 'code',
            label: 'Código',
            placeholder: 'Código',
            mobileOrder: 2,
          },
          {
            type: 'select',
            name: 'status',
            label: 'Status',
            placeholder: 'Todos os status',
            options: [
              { value: 'active', label: 'Ativo' },
              { value: 'inactive', label: 'Inativo' },
            ],
            mobileOrder: 3,
          },
          ...typeField,
        ]}
        values={model.filterValues}
        onChange={model.onFilterChange}
        onApply={model.applyFilters}
        onClear={model.clearFilters}
        loading={model.list.loading}
      />
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
            Use filtros para localizar registros por nome, código, status ou tipo.
          </AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};
