import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppCard } from '@shared/components/data-display/AppCard';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppForm } from '@shared/components/form/AppForm';
import { AppStack } from '@shared/components/layout/AppStack';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useParams } from 'react-router-dom';
import { useStudentEnrollmentEditPage } from '@features/client/student-enrollments/hooks/useStudentEnrollmentEditPage';
import type { StudentEnrollmentEditFormValues } from '@features/client/student-enrollments/schemas/studentEnrollmentEditForm.schema';

const StudentEnrollmentEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const studentEnrollmentEditPage = useStudentEnrollmentEditPage(id ?? '');

  if (studentEnrollmentEditPage.loading) {
    return <AppCircularProgress ariaLabel="Carregando matrícula" />;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Editar Matrícula"
        subtitle="Atualize dados acadêmicos e observações da matrícula."
        actionLabel="Voltar"
        onAction={() => {
          studentEnrollmentEditPage.onBack();
        }}
      />
      {studentEnrollmentEditPage.errorMessage ? (
        <AppAlert severity="error">{studentEnrollmentEditPage.errorMessage}</AppAlert>
      ) : null}
      <AppCard>
        <AppForm
          form={studentEnrollmentEditPage.form}
          onSubmit={studentEnrollmentEditPage.onSubmit}
          useResponsiveGrid
        >
          <FormTextField<StudentEnrollmentEditFormValues>
            name="academicYearId"
            label="ID do ano letivo"
            disabled={studentEnrollmentEditPage.submitting}
          />
          <FormTextField<StudentEnrollmentEditFormValues>
            name="schoolClassId"
            label="ID da turma"
            disabled={studentEnrollmentEditPage.submitting}
          />
          <FormTextField<StudentEnrollmentEditFormValues>
            name="enrollmentDate"
            label="Data da matrícula"
            disabled={studentEnrollmentEditPage.submitting}
          />
          <FormTextField<StudentEnrollmentEditFormValues>
            name="enrollmentCode"
            label="Código da matrícula"
            disabled={studentEnrollmentEditPage.submitting}
          />
          <FormTextField<StudentEnrollmentEditFormValues>
            name="observations"
            label="Observações"
            disabled={studentEnrollmentEditPage.submitting}
          />
          <FormActions
            secondaryAction={{
              type: 'cancel',
              label: 'Cancelar',
              onClick: () => {
                studentEnrollmentEditPage.onBack();
              },
              disabled: studentEnrollmentEditPage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: studentEnrollmentEditPage.submitting ? 'Salvando...' : 'Salvar alterações',
              onClick: () => {
                void studentEnrollmentEditPage.form.handleSubmit(
                  studentEnrollmentEditPage.onSubmit,
                )();
              },
              disabled: studentEnrollmentEditPage.submitting,
            }}
          />
        </AppForm>
      </AppCard>
    </AppStack>
  );
};

export default StudentEnrollmentEditPage;
