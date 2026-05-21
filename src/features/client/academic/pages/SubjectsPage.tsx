import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { subjectCatalogConfig } from '@features/client/academic/constants/academicCatalogPageConfigs';
import { useAcademicCatalogListPage } from '@features/client/academic/hooks/useAcademicCatalogListPage';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';

const SubjectsPage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const subjectsPage = useAcademicCatalogListPage({
    service: subjectCatalogConfig.service,
    routeBase: subjectCatalogConfig.routeBase,
    errorMessageFallback: subjectCatalogConfig.errorMessageFallback,
  });

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={subjectCatalogConfig.title}
        subtitle={subjectCatalogConfig.subtitle}
        actionLabel="Cadastrar"
        canShowAction={permissions.can(subjectCatalogConfig.createPermission)}
        onAction={() => {
          void navigate(`${subjectCatalogConfig.routeBase}/new`);
        }}
      />
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: subjectCatalogConfig.searchPlaceholder,
            mobileOrder: 1,
          },
          {
            type: 'text',
            name: 'code',
            label: 'Código',
            placeholder: subjectCatalogConfig.codePlaceholder,
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
        values={subjectsPage.filterValues}
        onChange={subjectsPage.onFilterChange}
        onApply={subjectsPage.applyFilters}
        onClear={subjectsPage.clearFilters}
        loading={subjectsPage.academicCatalogList.loading}
      />
      <QueryDataTable
        rows={subjectsPage.academicCatalogList.rows}
        columns={subjectsPage.tableColumns}
        mobileConfig={subjectsPage.mobileConfig}
        meta={subjectsPage.academicCatalogList.meta}
        loading={subjectsPage.academicCatalogList.loading}
        errorMessage={subjectsPage.academicCatalogList.errorMessage}
        onRetry={() => {
          void subjectsPage.academicCatalogList.reload();
        }}
        query={subjectsPage.academicCatalogList.query.search ?? ''}
        onQueryChange={(search) =>
          subjectsPage.academicCatalogList.updateQuery({ search, page: 1 })
        }
        onPageChange={(page) => subjectsPage.academicCatalogList.updateQuery({ page })}
        onRowsPerPageChange={(limit) =>
          subjectsPage.academicCatalogList.updateQuery({ limit, page: 1 })
        }
        emptyTitle={subjectCatalogConfig.emptyTitle}
        emptyDescription={subjectCatalogConfig.emptyDescription}
        toolbarContent={
          <AppText color="text.secondary">{subjectCatalogConfig.toolbarDescription}</AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default SubjectsPage;
