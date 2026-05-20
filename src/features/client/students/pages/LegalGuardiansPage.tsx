import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';
import { useLegalGuardiansListPage } from '@features/client/students/hooks/useLegalGuardiansListPage';

const LegalGuardiansPage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const legalGuardianListPage = useLegalGuardiansListPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Responsáveis"
        subtitle="Gerencie responsáveis legais e vínculos com alunos."
        actionLabel="Cadastrar"
        canShowAction={permissions.can('legal-guardian:create')}
        onAction={() => void navigate('/client/legal-guardians/new')}
      />
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: 'Nome ou documento',
            mobileOrder: 1,
          },
          {
            type: 'select',
            name: 'relationshipType',
            label: 'Vínculo',
            placeholder: 'Todos os vínculos',
            options: [
              { value: '', label: 'Todos os vínculos' },
              { value: 'mother', label: 'Mãe' },
              { value: 'father', label: 'Pai' },
              { value: 'legal_guardian', label: 'Responsável legal' },
              { value: 'grandparent', label: 'Avô/avó' },
              { value: 'other', label: 'Outro' },
            ],
            mobileOrder: 2,
          },
        ]}
        values={legalGuardianListPage.filterValues}
        onChange={legalGuardianListPage.onFilterChange}
        onApply={legalGuardianListPage.applyFilters}
        onClear={legalGuardianListPage.clearFilters}
        loading={legalGuardianListPage.legalGuardianList.loading}
      />
      <QueryDataTable
        rows={legalGuardianListPage.legalGuardianList.rows}
        columns={legalGuardianListPage.columns}
        mobileConfig={legalGuardianListPage.mobileConfig}
        meta={legalGuardianListPage.legalGuardianList.meta}
        loading={legalGuardianListPage.legalGuardianList.loading}
        errorMessage={legalGuardianListPage.legalGuardianList.errorMessage}
        onRetry={() => {
          void legalGuardianListPage.legalGuardianList.reload();
        }}
        query={legalGuardianListPage.legalGuardianList.query.search ?? ''}
        onQueryChange={legalGuardianListPage.onQueryChange}
        onPageChange={legalGuardianListPage.onPageChange}
        onRowsPerPageChange={legalGuardianListPage.onLimitChange}
        emptyTitle="Nenhum responsável encontrado"
        emptyDescription="Responsáveis vinculados aos alunos aparecerão aqui."
        toolbarContent={
          <AppText color="text.secondary">
            Use filtros para localizar responsáveis por busca geral ou vínculo.
          </AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default LegalGuardiansPage;
