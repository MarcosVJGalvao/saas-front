import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useAcademicCatalogListPageViewModel } from '@features/client/academic/hooks/useAcademicCatalogListPageViewModel';
import type {
  AcademicCatalogItem,
  AcademicCatalogQueryParams,
} from '@features/client/academic/types/academic.types';
import type { ClientCrudService } from '@features/client/shared/types/clientApi.types';

type AcademicCatalogService = Pick<
  ClientCrudService<
    AcademicCatalogItem,
    AcademicCatalogItem,
    Record<string, unknown>,
    Record<string, unknown>,
    AcademicCatalogQueryParams
  >,
  'list'
>;

type AcademicCatalogListPageProps = {
  title: string;
  subtitle: string;
  routeBase: string;
  service: AcademicCatalogService;
  errorMessageFallback: string;
  emptyTitle: string;
  emptyDescription: string;
  showEducationLevel?: boolean | undefined;
};

export const AcademicCatalogListPage = ({
  title,
  subtitle,
  routeBase,
  service,
  errorMessageFallback,
  emptyTitle,
  emptyDescription,
  showEducationLevel = false,
}: AcademicCatalogListPageProps) => {
  const navigate = useNavigate();
  const model = useAcademicCatalogListPageViewModel({
    service,
    routeBase,
    errorMessageFallback,
    showEducationLevel,
  });

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
              { value: '', label: 'Todos os status' },
              { value: 'active', label: 'Ativo' },
              { value: 'inactive', label: 'Inativo' },
            ],
            mobileOrder: 3,
          },
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
            Use os filtros para localizar registros por nome, código ou status.
          </AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};
