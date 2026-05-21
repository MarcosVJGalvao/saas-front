import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { educationLevelCatalogConfig } from '@features/client/academic/constants/academicCatalogPageConfigs';
import { useAcademicCatalogListPage } from '@features/client/academic/hooks/useAcademicCatalogListPage';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';

const EducationLevelsPage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const educationLevelsPage = useAcademicCatalogListPage({
    service: educationLevelCatalogConfig.service,
    routeBase: educationLevelCatalogConfig.routeBase,
    errorMessageFallback: educationLevelCatalogConfig.errorMessageFallback,
  });

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={educationLevelCatalogConfig.title}
        subtitle={educationLevelCatalogConfig.subtitle}
        actionLabel="Cadastrar"
        canShowAction={permissions.can(educationLevelCatalogConfig.createPermission)}
        onAction={() => {
          void navigate(`${educationLevelCatalogConfig.routeBase}/new`);
        }}
      />
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: educationLevelCatalogConfig.searchPlaceholder,
            mobileOrder: 1,
          },
          {
            type: 'text',
            name: 'code',
            label: 'Código',
            placeholder: educationLevelCatalogConfig.codePlaceholder,
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
        values={educationLevelsPage.filterValues}
        onChange={educationLevelsPage.onFilterChange}
        onApply={educationLevelsPage.applyFilters}
        onClear={educationLevelsPage.clearFilters}
        loading={educationLevelsPage.academicCatalogList.loading}
      />
      <QueryDataTable
        rows={educationLevelsPage.academicCatalogList.rows}
        columns={educationLevelsPage.tableColumns}
        mobileConfig={educationLevelsPage.mobileConfig}
        meta={educationLevelsPage.academicCatalogList.meta}
        loading={educationLevelsPage.academicCatalogList.loading}
        errorMessage={educationLevelsPage.academicCatalogList.errorMessage}
        onRetry={() => {
          void educationLevelsPage.academicCatalogList.reload();
        }}
        query={educationLevelsPage.academicCatalogList.query.search ?? ''}
        onQueryChange={(search) =>
          educationLevelsPage.academicCatalogList.updateQuery({ search, page: 1 })
        }
        onPageChange={(page) => educationLevelsPage.academicCatalogList.updateQuery({ page })}
        onRowsPerPageChange={(limit) =>
          educationLevelsPage.academicCatalogList.updateQuery({ limit, page: 1 })
        }
        emptyTitle={educationLevelCatalogConfig.emptyTitle}
        emptyDescription={educationLevelCatalogConfig.emptyDescription}
        toolbarContent={
          <AppText color="text.secondary">{educationLevelCatalogConfig.toolbarDescription}</AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default EducationLevelsPage;
