import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppStack } from '@shared/components/layout/AppStack';
import { layoutSpacing } from '@theme/spacing';
import { useSchoolClassDetailsPageViewModel } from '@features/client/academic/hooks/useSchoolClassDetailsPageViewModel';

const SchoolClassDetailsPage = () => {
  const model = useSchoolClassDetailsPageViewModel();
  const actionDisabled = model.actionLoading !== undefined;

  return (
    <AppStack spacing={2}>
      <EntityDetailsPage
        viewState={model.viewState}
        content={model.content}
        data={model.data}
        errorMessage={model.errorMessage}
        onBack={model.onBack}
        onRetry={() => {
          void model.onRetry();
        }}
      />
      {model.actionErrorMessage ? (
        <AppAlert severity="error">{model.actionErrorMessage}</AppAlert>
      ) : null}
      {model.actionSuccessMessage ? (
        <AppAlert severity="success">{model.actionSuccessMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
        <AppStack spacing={2}>
          <AppText variant="h6">Vínculos de alunos</AppText>
          <AppText color="text.secondary">
            Informe um ou mais IDs separados por vírgula para adicionar ou remover alunos da turma.
          </AppText>
          <ListFilters
            fields={[
              {
                type: 'text',
                name: 'studentIds',
                label: 'Alunos',
                placeholder: 'student-1, student-2',
                mobileOrder: 1,
              },
            ]}
            values={model.actionValues}
            onChange={model.onActionValueChange}
            onApply={() => {
              void model.assignStudents();
            }}
            onClear={model.clearActionValues}
            loading={actionDisabled}
            applyLabel="Adicionar alunos"
          />
          <ListFilters
            fields={[
              {
                type: 'text',
                name: 'studentIds',
                label: 'Alunos',
                placeholder: 'student-1, student-2',
                mobileOrder: 1,
              },
            ]}
            values={model.actionValues}
            onChange={model.onActionValueChange}
            onApply={() => {
              void model.removeStudents();
            }}
            onClear={model.clearActionValues}
            loading={actionDisabled}
            applyLabel="Remover alunos"
          />
        </AppStack>
      </AppPaper>
      <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
        <AppStack spacing={2}>
          <AppText variant="h6">Vínculos professor-disciplina</AppText>
          <AppText color="text.secondary">
            Informe um ou mais IDs de professor-disciplina separados por vírgula.
          </AppText>
          <ListFilters
            fields={[
              {
                type: 'text',
                name: 'teacherSubjectIds',
                label: 'Professor-disciplina',
                placeholder: 'teacher-subject-1, teacher-subject-2',
                mobileOrder: 1,
              },
            ]}
            values={model.actionValues}
            onChange={model.onActionValueChange}
            onApply={() => {
              void model.assignTeacherSubjects();
            }}
            onClear={model.clearActionValues}
            loading={actionDisabled}
            applyLabel="Adicionar vínculos"
          />
          <ListFilters
            fields={[
              {
                type: 'text',
                name: 'teacherSubjectIds',
                label: 'Professor-disciplina',
                placeholder: 'teacher-subject-1, teacher-subject-2',
                mobileOrder: 1,
              },
            ]}
            values={model.actionValues}
            onChange={model.onActionValueChange}
            onApply={() => {
              void model.removeTeacherSubjects();
            }}
            onClear={model.clearActionValues}
            loading={actionDisabled}
            applyLabel="Remover vínculos"
          />
        </AppStack>
      </AppPaper>
    </AppStack>
  );
};

export default SchoolClassDetailsPage;
