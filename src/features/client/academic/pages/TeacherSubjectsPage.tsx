import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { BaseModal } from '@shared/components/modal/BaseModal';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { AppSelect } from '@shared/components/inputs/AppSelect';
import { AppButton } from '@shared/components/inputs/AppButton';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { layoutSpacing, radiusScale } from '@theme/spacing';
import { activeInactiveStatusOptions } from '@shared/constants/selectOptions';
import { useTeacherSubjectsListPage } from '@features/client/academic/hooks/useTeacherSubjectsListPage';

const TeacherSubjectsPage = () => {
  const teacherSubjectsPage = useTeacherSubjectsListPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Professor-disciplina"
        subtitle="Controle vínculos entre professores e disciplinas."
      />
      {teacherSubjectsPage.referenceOptions.errorMessage ? (
        <AppAlert severity="error">{teacherSubjectsPage.referenceOptions.errorMessage}</AppAlert>
      ) : teacherSubjectsPage.feedback.message ? (
        <AppAlert severity={teacherSubjectsPage.feedback.message.type}>
          {teacherSubjectsPage.feedback.message.text}
        </AppAlert>
      ) : null}
      <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: radiusScale.md }}>
        <AppStack spacing={2}>
          <AppText variant="h6">Novo vínculo</AppText>
          <AppText color="text.secondary">
            Cadastre um novo vínculo selecionando um professor e uma disciplina.
          </AppText>
          <AppStack direction="row" sx={{ justifyContent: 'flex-end' }}>
            <AppButton
              variant="contained"
              onClick={teacherSubjectsPage.openCreateModal}
              disabled={teacherSubjectsPage.referenceOptions.loading}
            >
              Novo vínculo
            </AppButton>
          </AppStack>
        </AppStack>
      </AppPaper>
      <ListFilters
        fields={[
          {
            type: 'select',
            name: 'teacherId',
            label: 'Professor',
            placeholder: 'Todos os professores',
            options: teacherSubjectsPage.referenceOptions.teacherOptions,
            mobileOrder: 1,
          },
          {
            type: 'select',
            name: 'subjectId',
            label: 'Disciplina',
            placeholder: 'Todas as disciplinas',
            options: teacherSubjectsPage.referenceOptions.subjectOptions,
            mobileOrder: 2,
          },
          {
            type: 'select',
            name: 'status',
            label: 'Status',
            placeholder: 'Todos os status',
            options: activeInactiveStatusOptions,
            mobileOrder: 3,
          },
        ]}
        values={teacherSubjectsPage.filterValues}
        onChange={teacherSubjectsPage.onFilterChange}
        onApply={teacherSubjectsPage.applyFilters}
        onClear={teacherSubjectsPage.clearFilters}
        loading={
          teacherSubjectsPage.teacherSubjectsList.loading ||
          teacherSubjectsPage.actionLoading ||
          teacherSubjectsPage.referenceOptions.loading
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
      <BaseModal
        open={teacherSubjectsPage.isCreateModalOpen}
        title="Criar vínculo professor-disciplina"
        confirmText={teacherSubjectsPage.actionLoading ? 'Criando...' : 'Criar vínculo'}
        cancelText="Cancelar"
        loading={teacherSubjectsPage.actionLoading}
        onClose={teacherSubjectsPage.closeCreateModal}
        onConfirm={() => {
          void teacherSubjectsPage.createTeacherSubject();
        }}
        content={
          <AppStack spacing={2} sx={{ pt: 1 }}>
            <AppText color="text.secondary">
              Selecione um professor do cargo docente e a disciplina para criar o vínculo.
            </AppText>
            <AppSelect
              label="Professor"
              value={teacherSubjectsPage.createValues.teacherId}
              onChange={(event) => {
                teacherSubjectsPage.onCreateChange('teacherId', event.target.value);
              }}
              options={teacherSubjectsPage.referenceOptions.teacherOptions}
              disabled={
                teacherSubjectsPage.actionLoading || teacherSubjectsPage.referenceOptions.loading
              }
            />
            <AppSelect
              label="Disciplina"
              value={teacherSubjectsPage.createValues.subjectId}
              onChange={(event) => {
                teacherSubjectsPage.onCreateChange('subjectId', event.target.value);
              }}
              options={teacherSubjectsPage.referenceOptions.subjectOptions}
              disabled={
                teacherSubjectsPage.actionLoading || teacherSubjectsPage.referenceOptions.loading
              }
            />
          </AppStack>
        }
      />
    </AppStack>
  );
};

export default TeacherSubjectsPage;
