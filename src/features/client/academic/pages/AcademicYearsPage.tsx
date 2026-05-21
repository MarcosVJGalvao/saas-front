import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useAcademicYearsListPage } from '@features/client/academic/hooks/useAcademicYearsListPage';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';

const AcademicYearsPage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const academicYearsPage = useAcademicYearsListPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Anos letivos"
        subtitle="Gerencie períodos, políticas de boletim e encerramento do ano letivo."
        actionLabel="Cadastrar"
        canShowAction={permissions.can('academic-year:create')}
        onAction={() => {
          void navigate('/client/academic-years/new');
        }}
      />
      {academicYearsPage.actionErrorMessage ? (
        <AppAlert severity="error">{academicYearsPage.actionErrorMessage}</AppAlert>
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
        values={academicYearsPage.filterValues}
        onChange={academicYearsPage.onFilterChange}
        onApply={academicYearsPage.applyFilters}
        onClear={academicYearsPage.clearFilters}
        loading={academicYearsPage.academicYearsList.loading || academicYearsPage.actionLoading}
      />
      <QueryDataTable
        rows={academicYearsPage.academicYearsList.rows}
        columns={academicYearsPage.tableColumns}
        mobileConfig={academicYearsPage.mobileConfig}
        meta={academicYearsPage.academicYearsList.meta}
        loading={academicYearsPage.academicYearsList.loading}
        errorMessage={academicYearsPage.academicYearsList.errorMessage}
        onRetry={() => {
          void academicYearsPage.academicYearsList.reload();
        }}
        query={academicYearsPage.academicYearsList.query.search ?? ''}
        onQueryChange={(search) =>
          academicYearsPage.academicYearsList.updateQuery({ search, page: 1 })
        }
        onPageChange={(page) => academicYearsPage.academicYearsList.updateQuery({ page })}
        onRowsPerPageChange={(limit) =>
          academicYearsPage.academicYearsList.updateQuery({ limit, page: 1 })
        }
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
        open={academicYearsPage.actionDialog.open}
        title={academicYearsPage.actionDialog.title}
        description={academicYearsPage.actionDialog.description}
        confirmLabel={academicYearsPage.actionDialog.confirmLabel}
        onCancel={academicYearsPage.actionDialog.close}
        onConfirm={() => {
          void academicYearsPage.actionDialog.confirm();
        }}
      />
    </AppStack>
  );
};

export default AcademicYearsPage;
