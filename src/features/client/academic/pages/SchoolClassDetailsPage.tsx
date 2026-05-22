import { useNavigate, useParams } from 'react-router-dom';
import { BindingCard } from '@features/client/academic/components/BindingCard';
import { ClassReportCardCard } from '@features/client/academic/components/ClassReportCardCard';
import { PeriodClosureCard } from '@features/client/academic/components/PeriodClosureCard';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useSchoolClassBindingOptions } from '@features/client/academic/hooks/useSchoolClassBindingOptions';
import { useSchoolClassDetailsPage } from '@features/client/academic/hooks/useSchoolClassDetailsPage';
import { useSchoolClassPeriodActions } from '@features/client/academic/hooks/useSchoolClassPeriodActions';

const SchoolClassDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const schoolClassDetailsPage = useSchoolClassDetailsPage(id ?? '');
  const periodActions = useSchoolClassPeriodActions(id ?? '');
  const bindingOptions = useSchoolClassBindingOptions();

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
        actions={
          <AppButton
            variant="outlined"
            onClick={() => {
              void navigate('/client/report-cards/entries');
            }}
          >
            Lançar notas
          </AppButton>
        }
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
        description="Selecione os alunos a vincular ou desvincular desta turma."
        inputLabel="Alunos"
        inputPlaceholder="Buscar alunos..."
        options={bindingOptions.studentOptions}
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
        optionsLoading={bindingOptions.loading}
      />
      <BindingCard
        title="Vínculos professor-disciplina"
        description="Selecione os vínculos professor-disciplina a adicionar ou remover desta turma."
        inputLabel="Professor-disciplina"
        inputPlaceholder="Buscar professor-disciplina..."
        options={bindingOptions.teacherSubjectOptions}
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
        optionsLoading={bindingOptions.loading}
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
