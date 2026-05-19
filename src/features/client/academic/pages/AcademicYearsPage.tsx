import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useAcademicYearsListPageViewModel } from '@features/client/academic/hooks/useAcademicYearsListPageViewModel';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';

const AcademicYearsPage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const model = useAcademicYearsListPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Anos letivos"
        subtitle="Gerencie períodos, políticas de boletim e encerramento do ano letivo."
        actionLabel="Cadastrar"
        canShowAction={permissions.can('client:academic-year:create')}
        onAction={() => void navigate('/client/academic-years/new')}
      />
      {model.actionErrorMessage ? (
        <AppAlert severity="error">{model.actionErrorMessage}</AppAlert>
      ) : null}
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: 'Nome do ano letivo',
            mobileOrder: 1,
          },
          {
            type: 'text',
            name: 'code',
            label: 'Código',
            placeholder: 'Código do ano letivo',
            mobileOrder: 2,
          },
          {
            type: 'select',
            name: 'status',
            label: 'Status',
            placeholder: 'Todos os status',
            options: [
              { value: '', label: 'Todos os status' },
              { value: 'scheduled', label: 'Agendado' },
              { value: 'active', label: 'Ativo' },
              { value: 'closed', label: 'Encerrado' },
            ],
            mobileOrder: 3,
          },
        ]}
        values={model.filterValues}
        onChange={model.onFilterChange}
        onApply={model.applyFilters}
        onClear={model.clearFilters}
        loading={model.list.loading || model.actionLoading}
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
        emptyTitle="Nenhum ano letivo encontrado"
        emptyDescription="Cadastre anos letivos para organizar matrículas e boletins."
        toolbarContent={
          <AppText color="text.secondary">
            Fechamento e reabertura exigem confirmação para proteger o calendário acadêmico.
          </AppText>
        }
        hideToolbar
      />
      <ConfirmDialog
        open={model.actionDialogOpen}
        title={model.actionDialogTitle}
        description={model.actionDialogDescription}
        confirmLabel={model.actionConfirmLabel}
        onCancel={model.closeActionDialog}
        onConfirm={() => {
          void model.confirmAction();
        }}
      />
    </AppStack>
  );
};

export default AcademicYearsPage;
