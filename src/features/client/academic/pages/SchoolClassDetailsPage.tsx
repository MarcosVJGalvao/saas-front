import { useParams } from 'react-router-dom';
import { BindingCard } from '@features/client/academic/components/BindingCard';
import { ClassReportCardCard } from '@features/client/academic/components/ClassReportCardCard';
import { PeriodClosureCard } from '@features/client/academic/components/PeriodClosureCard';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useSchoolClassDetailsPage } from '@features/client/academic/hooks/useSchoolClassDetailsPage';
import { useSchoolClassPeriodActions } from '@features/client/academic/hooks/useSchoolClassPeriodActions';

const SchoolClassDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const schoolClassDetailsPage = useSchoolClassDetailsPage(id ?? '');
  const periodActions = useSchoolClassPeriodActions(id ?? '');

  if (!id) {
    return null;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Detalhes da turma"
        subtitle="Consulte dados acadêmicos, capacidade e resumo operacional da turma."
        actionLabel="Voltar"
        onAction={() => {
          schoolClassDetailsPage.onBack();
        }}
      />
      <EntityDetailsPage
        viewState={schoolClassDetailsPage.viewState}
        data={schoolClassDetailsPage.data}
        errorMessage={schoolClassDetailsPage.errorMessage}
        onRetry={() => {
          void schoolClassDetailsPage.onRetry();
        }}
      />
      {schoolClassDetailsPage.actionErrorMessage ? (
        <AppAlert severity="error">{schoolClassDetailsPage.actionErrorMessage}</AppAlert>
      ) : null}
      {schoolClassDetailsPage.actionSuccessMessage ? (
        <AppAlert severity="success">{schoolClassDetailsPage.actionSuccessMessage}</AppAlert>
      ) : null}
      <BindingCard
        title="Vínculos de alunos"
        description="Informe um ou mais IDs de alunos separados por vírgula."
        inputLabel="IDs dos alunos"
        inputPlaceholder="id-aluno-1, id-aluno-2"
        value={schoolClassDetailsPage.actionValues.studentIds}
        onChange={(value) => schoolClassDetailsPage.onActionValueChange('studentIds', value)}
        onAdd={() => {
          void schoolClassDetailsPage.assignStudents();
        }}
        onRemove={() => {
          void schoolClassDetailsPage.removeStudents();
        }}
        addLabel="Adicionar alunos"
        removeLabel="Remover alunos"
        isAddLoading={schoolClassDetailsPage.actionLoading === 'assign-students'}
        isRemoveLoading={schoolClassDetailsPage.actionLoading === 'remove-students'}
      />
      <BindingCard
        title="Vínculos professor-disciplina"
        description="Informe um ou mais IDs de professor-disciplina separados por vírgula."
        inputLabel="IDs de professor-disciplina"
        inputPlaceholder="id-prof-disc-1, id-prof-disc-2"
        value={schoolClassDetailsPage.actionValues.teacherSubjectIds}
        onChange={(value) => schoolClassDetailsPage.onActionValueChange('teacherSubjectIds', value)}
        onAdd={() => {
          void schoolClassDetailsPage.assignTeacherSubjects();
        }}
        onRemove={() => {
          void schoolClassDetailsPage.removeTeacherSubjects();
        }}
        addLabel="Adicionar vínculos"
        removeLabel="Remover vínculos"
        isAddLoading={schoolClassDetailsPage.actionLoading === 'assign-teacher-subjects'}
        isRemoveLoading={schoolClassDetailsPage.actionLoading === 'remove-teacher-subjects'}
      />
      <PeriodClosureCard
        academicPeriodOptions={periodActions.academicPeriodOptions}
        selectedPeriodId={periodActions.selectedPeriodId}
        onPeriodChange={periodActions.onPeriodChange}
        onFinalize={() => {
          void periodActions.finalizePeriod();
        }}
        onReopen={() => {
          void periodActions.reopenPeriod();
        }}
        isFinalizeLoading={periodActions.isFinalizeLoading}
        isReopenLoading={periodActions.isReopenLoading}
        message={periodActions.periodMessage}
      />
      <ClassReportCardCard
        loading={periodActions.reportCardLoading}
        message={periodActions.reportCardMessage}
        onQuery={() => {
          void periodActions.loadClassReportCard();
        }}
      />
    </AppStack>
  );
};

export default SchoolClassDetailsPage;
