import { useNavigate } from 'react-router-dom';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { useAdminEntitiesListPageViewModel } from '@features/client/admin/hooks/useAdminEntitiesListPageViewModel';
import type {
  ClientAdminEntity,
  ClientAdminQueryParams,
} from '@features/client/admin/types/admin.types';

type AdminEntitiesService = {
  list: (params: ClientAdminQueryParams) => Promise<{
    data: ClientAdminEntity[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }>;
};

type AdminEntitiesListPageProps = {
  title: string;
  subtitle: string;
  routeBase: string;
  service: AdminEntitiesService;
  errorMessageFallback: string;
  emptyTitle: string;
  emptyDescription: string;
  showRole?: boolean | undefined;
  showPermissions?: boolean | undefined;
};

export const AdminEntitiesListPage = ({
  title,
  subtitle,
  routeBase,
  service,
  errorMessageFallback,
  emptyTitle,
  emptyDescription,
  showRole = false,
  showPermissions = false,
}: AdminEntitiesListPageProps) => {
  const navigate = useNavigate();
  const model = useAdminEntitiesListPageViewModel({
    service,
    errorMessageFallback,
    routeBase,
    showRole,
    showPermissions,
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
            placeholder: 'Nome ou e-mail',
            mobileOrder: 1,
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
            mobileOrder: 2,
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
          <AppText color="text.secondary">Use a busca geral para localizar registros.</AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};
