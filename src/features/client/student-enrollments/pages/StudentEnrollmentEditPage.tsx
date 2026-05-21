import { useParams } from 'react-router-dom';
import { useStudentEnrollmentEditPage } from '@features/client/student-enrollments/hooks/useStudentEnrollmentEditPage';
import type { StudentEnrollmentEditFormValues } from '@features/client/student-enrollments/schemas/studentEnrollmentEditForm.schema';
import { AppCard } from '@shared/components/data-display/AppCard';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormDatePicker } from '@shared/components/form/FormDatePicker';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';

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
      {studentEnrollmentEditPage.referenceOptions.errorMessage ? (
        <AppAlert severity="error">
          {studentEnrollmentEditPage.referenceOptions.errorMessage}
        </AppAlert>
      ) : null}
      <AppCard>
        <AppForm
          form={studentEnrollmentEditPage.form}
          onSubmit={studentEnrollmentEditPage.onSubmit}
          useResponsiveGrid
        >
          <FormSelect<StudentEnrollmentEditFormValues>
            name="academicYearId"
            label="Ano letivo"
            options={studentEnrollmentEditPage.referenceOptions.academicYearOptions}
            disabled={
              studentEnrollmentEditPage.submitting ||
              studentEnrollmentEditPage.referenceOptions.loading
            }
          />
          <FormSelect<StudentEnrollmentEditFormValues>
            name="schoolClassId"
            label="Turma"
            options={studentEnrollmentEditPage.referenceOptions.schoolClassOptions}
            disabled={
              studentEnrollmentEditPage.submitting ||
              studentEnrollmentEditPage.referenceOptions.loading
            }
          />
          <FormDatePicker<StudentEnrollmentEditFormValues>
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
