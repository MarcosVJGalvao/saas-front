import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { layoutSpacing } from '@theme/spacing';
import { useTeacherSubjectsListPage } from '@features/client/academic/hooks/useTeacherSubjectsListPage';

const TeacherSubjectsPage = () => {
  const teacherSubjectsPage = useTeacherSubjectsListPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Professor-disciplina"
        subtitle="Controle vínculos entre professores e disciplinas."
      />
      {teacherSubjectsPage.actionErrorMessage ? (
        <AppAlert severity="error">{teacherSubjectsPage.actionErrorMessage}</AppAlert>
      ) : null}
      {teacherSubjectsPage.actionSuccessMessage ? (
        <AppAlert severity="success">{teacherSubjectsPage.actionSuccessMessage}</AppAlert>
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
            values={teacherSubjectsPage.createValues}
            onChange={teacherSubjectsPage.onCreateChange}
            onApply={() => {
              void teacherSubjectsPage.createTeacherSubject();
            }}
            onClear={() => {
              teacherSubjectsPage.onCreateChange('teacherId', '');
              teacherSubjectsPage.onCreateChange('subjectId', '');
            }}
            loading={teacherSubjectsPage.actionLoading}
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
        values={teacherSubjectsPage.filterValues}
        onChange={teacherSubjectsPage.onFilterChange}
        onApply={teacherSubjectsPage.applyFilters}
        onClear={teacherSubjectsPage.clearFilters}
        loading={
          teacherSubjectsPage.teacherSubjectsList.loading || teacherSubjectsPage.actionLoading
        }
      />
      <QueryDataTable
        rows={teacherSubjectsPage.teacherSubjectsList.rows}
        columns={teacherSubjectsPage.tableColumns}
        mobileConfig={teacherSubjectsPage.mobileConfig}
        meta={teacherSubjectsPage.teacherSubjectsList.meta}
        loading={teacherSubjectsPage.teacherSubjectsList.loading}
        errorMessage={teacherSubjectsPage.teacherSubjectsList.errorMessage}
        onRetry={() => {
          void teacherSubjectsPage.teacherSubjectsList.reload();
        }}
        query={teacherSubjectsPage.teacherSubjectsList.query.search ?? ''}
        onQueryChange={(search) =>
          teacherSubjectsPage.teacherSubjectsList.updateQuery({ search, page: 1 })
        }
        onPageChange={(page) => teacherSubjectsPage.teacherSubjectsList.updateQuery({ page })}
        onRowsPerPageChange={(limit) =>
          teacherSubjectsPage.teacherSubjectsList.updateQuery({ limit, page: 1 })
        }
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
        open={teacherSubjectsPage.deleteDialog.open}
        title={teacherSubjectsPage.deleteDialog.title}
        description={teacherSubjectsPage.deleteDialog.description}
        confirmLabel={teacherSubjectsPage.deleteDialog.confirmLabel}
        onCancel={teacherSubjectsPage.deleteDialog.close}
        onConfirm={() => {
          void teacherSubjectsPage.deleteDialog.confirm();
        }}
      />
    </AppStack>
  );
};

export default TeacherSubjectsPage;
