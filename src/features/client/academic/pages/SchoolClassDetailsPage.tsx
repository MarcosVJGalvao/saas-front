import { useParams } from 'react-router-dom';
import { EntityDetailsPage } from '@shared/components/data-display/details/EntityDetailsPage';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppStack } from '@shared/components/layout/AppStack';
import { layoutSpacing } from '@theme/spacing';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useSchoolClassDetailsPage } from '@features/client/academic/hooks/useSchoolClassDetailsPage';

const SchoolClassDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const schoolClassDetailsPage = useSchoolClassDetailsPage(id ?? '');
  const actionDisabled = schoolClassDetailsPage.actionLoading !== undefined;

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
            values={schoolClassDetailsPage.actionValues}
            onChange={(name, value) => {
              if (name === 'studentIds' && typeof value === 'string') {
                schoolClassDetailsPage.onActionValueChange('studentIds', value);
              }
            }}
            onApply={() => {
              void schoolClassDetailsPage.assignStudents();
            }}
            onClear={schoolClassDetailsPage.clearActionValues}
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
            values={schoolClassDetailsPage.actionValues}
            onChange={(name, value) => {
              if (name === 'studentIds' && typeof value === 'string') {
                schoolClassDetailsPage.onActionValueChange('studentIds', value);
              }
            }}
            onApply={() => {
              void schoolClassDetailsPage.removeStudents();
            }}
            onClear={schoolClassDetailsPage.clearActionValues}
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
            values={schoolClassDetailsPage.actionValues}
            onChange={(name, value) => {
              if (name === 'teacherSubjectIds' && typeof value === 'string') {
                schoolClassDetailsPage.onActionValueChange('teacherSubjectIds', value);
              }
            }}
            onApply={() => {
              void schoolClassDetailsPage.assignTeacherSubjects();
            }}
            onClear={schoolClassDetailsPage.clearActionValues}
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
            values={schoolClassDetailsPage.actionValues}
            onChange={(name, value) => {
              if (name === 'teacherSubjectIds' && typeof value === 'string') {
                schoolClassDetailsPage.onActionValueChange('teacherSubjectIds', value);
              }
            }}
            onApply={() => {
              void schoolClassDetailsPage.removeTeacherSubjects();
            }}
            onClear={schoolClassDetailsPage.clearActionValues}
            loading={actionDisabled}
            applyLabel="Remover vínculos"
          />
        </AppStack>
      </AppPaper>
    </AppStack>
  );
};

export default SchoolClassDetailsPage;
