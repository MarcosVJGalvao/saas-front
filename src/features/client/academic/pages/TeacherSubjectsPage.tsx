import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { layoutSpacing } from '@theme/spacing';
import { useTeacherSubjectsListPageViewModel } from '@features/client/academic/hooks/useTeacherSubjectsListPageViewModel';

const TeacherSubjectsPage = () => {
  const model = useTeacherSubjectsListPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Professor-disciplina"
        subtitle="Controle vínculos entre professores e disciplinas."
      />
      {model.actionErrorMessage ? (
        <AppAlert severity="error">{model.actionErrorMessage}</AppAlert>
      ) : null}
      {model.actionSuccessMessage ? (
        <AppAlert severity="success">{model.actionSuccessMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
        <AppStack spacing={2}>
          <AppText variant="h6">Novo vínculo</AppText>
          <ListFilters
            fields={[
              {
                type: 'text',
                name: 'teacherId',
                label: 'Professor',
                placeholder: 'ID do professor',
                mobileOrder: 1,
              },
              {
                type: 'text',
                name: 'subjectId',
                label: 'Disciplina',
                placeholder: 'ID da disciplina',
                mobileOrder: 2,
              },
            ]}
            values={model.createValues}
            onChange={model.onCreateChange}
            onApply={() => {
              void model.createTeacherSubject();
            }}
            onClear={() => {
              model.onCreateChange('teacherId', '');
              model.onCreateChange('subjectId', '');
            }}
            loading={model.actionLoading}
            applyLabel="Criar vínculo"
          />
        </AppStack>
      </AppPaper>
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'teacherId',
            label: 'Professor',
            placeholder: 'ID do professor',
            mobileOrder: 1,
          },
          {
            type: 'text',
            name: 'subjectId',
            label: 'Disciplina',
            placeholder: 'ID da disciplina',
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
        emptyTitle="Nenhum vínculo encontrado"
        emptyDescription="Vínculos entre professores e disciplinas aparecerão aqui."
        toolbarContent={
          <AppText color="text.secondary">
            Remova vínculos somente quando não houver uso ativo em turmas.
          </AppText>
        }
        hideToolbar
      />
      <ConfirmDialog
        open={model.deleteDialogOpen}
        title={model.deleteDialogTitle}
        description={model.deleteDialogDescription}
        confirmLabel={model.deleteConfirmLabel}
        onCancel={model.closeDeleteDialog}
        onConfirm={() => {
          void model.confirmDelete();
        }}
      />
    </AppStack>
  );
};

export default TeacherSubjectsPage;
