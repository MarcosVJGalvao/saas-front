import { AppBox } from '@shared/components/layout/AppBox';
import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppStack } from '@shared/components/layout/AppStack';
import { educationLevelCatalogConfig } from '@features/client/academic/constants/academicCatalogPageConfigs';
import { useAcademicCatalogListPage } from '@features/client/academic/hooks/useAcademicCatalogListPage';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';

const EducationLevelsListTab = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const listPage = useAcademicCatalogListPage({
    service: educationLevelCatalogConfig.service,
    routeBase: educationLevelCatalogConfig.routeBase,
    errorMessageFallback: educationLevelCatalogConfig.errorMessageFallback,
  });

  return (
    <AppStack spacing={2}>
      {permissions.can(educationLevelCatalogConfig.createPermission) ? (
        <AppBox sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <AppButton
            variant="contained"
            onClick={() => {
              void navigate(`${educationLevelCatalogConfig.routeBase}/new`);
            }}
          >
            Cadastrar
          </AppButton>
        </AppBox>
      ) : null}
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
        values={listPage.filterValues}
        onChange={listPage.onFilterChange}
        onApply={listPage.applyFilters}
        onClear={listPage.clearFilters}
        loading={listPage.academicCatalogList.loading}
      />
      <QueryDataTable
        rows={listPage.academicCatalogList.rows}
        columns={listPage.tableColumns}
        mobileConfig={listPage.mobileConfig}
        meta={listPage.academicCatalogList.meta}
        loading={listPage.academicCatalogList.loading}
        errorMessage={listPage.academicCatalogList.errorMessage}
        onRetry={() => {
          void listPage.academicCatalogList.reload();
        }}
        query={listPage.academicCatalogList.query.search ?? ''}
        onQueryChange={(search) => listPage.academicCatalogList.updateQuery({ search, page: 1 })}
        onPageChange={(page) => listPage.academicCatalogList.updateQuery({ page })}
        onRowsPerPageChange={(limit) =>
          listPage.academicCatalogList.updateQuery({ limit, page: 1 })
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

export default EducationLevelsListTab;
