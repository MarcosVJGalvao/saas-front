import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppCard } from '@shared/components/data-display/AppCard';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppForm } from '@shared/components/form/AppForm';
import { AppStack } from '@shared/components/layout/AppStack';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useStudentEnrollmentEditPageViewModel } from '@features/client/student-enrollments/hooks/useStudentEnrollmentEditPageViewModel';
import type { UpdateStudentEnrollmentFormValues } from '@features/client/student-enrollments/schemas/studentEnrollmentSchemas';

const StudentEnrollmentEditPage = () => {
  const model = useStudentEnrollmentEditPageViewModel();

  if (model.loading) {
    return <AppCircularProgress ariaLabel="Carregando matrícula" />;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Editar Matrícula"
        subtitle="Atualize dados acadêmicos e observações da matrícula."
      />
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      <AppCard>
        <AppForm form={model.form} onSubmit={model.onSubmit} useResponsiveGrid>
          <FormTextField<UpdateStudentEnrollmentFormValues>
            name="academicYearId"
            label="ID do ano letivo"
            disabled={model.submitting}
          />
          <FormTextField<UpdateStudentEnrollmentFormValues>
            name="schoolClassId"
            label="ID da turma"
            disabled={model.submitting}
          />
          <FormTextField<UpdateStudentEnrollmentFormValues>
            name="enrollmentDate"
            label="Data da matrícula"
            disabled={model.submitting}
          />
          <FormTextField<UpdateStudentEnrollmentFormValues>
            name="enrollmentCode"
            label="Código da matrícula"
            disabled={model.submitting}
          />
          <FormTextField<UpdateStudentEnrollmentFormValues>
            name="observations"
            label="Observações"
            disabled={model.submitting}
          />
          <FormActions
            secondaryAction={{
              type: 'cancel',
              label: 'Cancelar',
              onClick: model.onCancel,
              disabled: model.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: model.submitting ? 'Salvando...' : 'Salvar alterações',
              onClick: () => {
                void model.form.handleSubmit(model.onSubmit)();
              },
              disabled: model.submitting,
            }}
          />
        </AppForm>
      </AppCard>
    </AppStack>
  );
};

export default StudentEnrollmentEditPage;
