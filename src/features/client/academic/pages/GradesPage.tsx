import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { gradeCatalogConfig } from '@features/client/academic/constants/academicCatalogPageConfigs';
import { useAcademicCatalogListPage } from '@features/client/academic/hooks/useAcademicCatalogListPage';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';

const GradesPage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const gradesPage = useAcademicCatalogListPage({
    service: gradeCatalogConfig.service,
    routeBase: gradeCatalogConfig.routeBase,
    errorMessageFallback: gradeCatalogConfig.errorMessageFallback,
    showEducationLevel: gradeCatalogConfig.showEducationLevel,
  });

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={gradeCatalogConfig.title}
        subtitle={gradeCatalogConfig.subtitle}
        actionLabel="Cadastrar"
        canShowAction={permissions.can(gradeCatalogConfig.createPermission)}
        onAction={() => {
          void navigate(`${gradeCatalogConfig.routeBase}/new`);
        }}
      />
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: gradeCatalogConfig.searchPlaceholder,
            mobileOrder: 1,
          },
          {
            type: 'text',
            name: 'code',
            label: 'Código',
            placeholder: gradeCatalogConfig.codePlaceholder,
            mobileOrder: 2,
          },
          {
            type: 'select',
            name: 'status',
            label: 'Status',
            placeholder: 'Todos os status',
            options: [
              { value: '', label: 'Todos os status' },
              { value: 'active', label: 'Ativa' },
              { value: 'inactive', label: 'Inativa' },
            ],
            mobileOrder: 3,
          },
        ]}
        values={gradesPage.filterValues}
        onChange={gradesPage.onFilterChange}
        onApply={gradesPage.applyFilters}
        onClear={gradesPage.clearFilters}
        loading={gradesPage.academicCatalogList.loading}
      />
      <QueryDataTable
        rows={gradesPage.academicCatalogList.rows}
        columns={gradesPage.tableColumns}
        mobileConfig={gradesPage.mobileConfig}
        meta={gradesPage.academicCatalogList.meta}
        loading={gradesPage.academicCatalogList.loading}
        errorMessage={gradesPage.academicCatalogList.errorMessage}
        onRetry={() => {
          void gradesPage.academicCatalogList.reload();
        }}
        query={gradesPage.academicCatalogList.query.search ?? ''}
        onQueryChange={(search) => gradesPage.academicCatalogList.updateQuery({ search, page: 1 })}
        onPageChange={(page) => gradesPage.academicCatalogList.updateQuery({ page })}
        onRowsPerPageChange={(limit) =>
          gradesPage.academicCatalogList.updateQuery({ limit, page: 1 })
        }
        emptyTitle={gradeCatalogConfig.emptyTitle}
        emptyDescription={gradeCatalogConfig.emptyDescription}
        toolbarContent={
          <AppText color="text.secondary">{gradeCatalogConfig.toolbarDescription}</AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default GradesPage;
