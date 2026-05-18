import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useStudentBasicFormPageViewModel } from '@features/client/students/hooks/useStudentBasicFormPageViewModel';
import type {
  LegalGuardianBasicFormValues,
  StudentBasicFormValues,
} from '@features/client/students/schemas/studentBasicFormSchema';
import type { LegalGuardian, Student } from '@features/client/students/types/student.types';

type StudentBasicFormMode = 'student' | 'guardian';

type StudentBasicFormService = {
  getById: (id: string) => Promise<Student | LegalGuardian>;
  create: (payload: Record<string, unknown>) => Promise<Student | LegalGuardian>;
  update: (id: string, payload: Record<string, unknown>) => Promise<Student | LegalGuardian>;
};

type StudentBasicFormPageProps = {
  mode: StudentBasicFormMode;
  title: string;
  editTitle: string;
  subtitle: string;
  backPath: string;
  service: StudentBasicFormService;
  loadErrorMessage: string;
  submitErrorMessage: string;
};

export const StudentBasicFormPage = ({
  mode,
  title,
  editTitle,
  subtitle,
  backPath,
  service,
  loadErrorMessage,
  submitErrorMessage,
}: StudentBasicFormPageProps) => {
  const model = useStudentBasicFormPageViewModel({
    mode,
    service,
    backPath,
    loadErrorMessage,
    submitErrorMessage,
  });

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={model.isEdit ? editTitle : title}
        subtitle={subtitle}
        actionLabel="Voltar"
        onAction={model.onBack}
      />
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      {model.loading ? (
        <AppCircularProgress ariaLabel="Carregando formulário" />
      ) : mode === 'student' ? (
        <AppPaper sx={{ p: 3 }}>
          <AppForm
            form={model.studentForm}
            onSubmit={model.submitStudent}
            useResponsiveGrid
            columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
          >
            <FormTextField<StudentBasicFormValues> name="fullName" label="Nome completo" />
            <FormTextField<StudentBasicFormValues> name="documentNumber" label="Documento" />
            <FormTextField<StudentBasicFormValues> name="documentType" label="Tipo de documento" />
            <FormTextField<StudentBasicFormValues>
              name="dateOfBirth"
              label="Nascimento"
              type="date"
            />
            <FormTextField<StudentBasicFormValues> name="gender" label="Gênero" />
            <FormTextField<StudentBasicFormValues>
              name="registrationCode"
              label="Código do aluno"
            />
            <FormTextField<StudentBasicFormValues> name="status" label="Status" />
            <FormActions
              secondaryAction={{
                type: 'back',
                label: 'Cancelar',
                onClick: model.onBack,
                disabled: model.submitting,
              }}
              primaryAction={{
                type: 'confirm',
                label: model.isEdit ? 'Salvar alterações' : 'Cadastrar',
                onClick: () => {
                  void model.studentForm.handleSubmit(model.submitStudent)();
                },
                loading: model.submitting,
              }}
            />
          </AppForm>
        </AppPaper>
      ) : (
        <AppPaper sx={{ p: 3 }}>
          <AppForm
            form={model.guardianForm}
            onSubmit={model.submitGuardian}
            useResponsiveGrid
            columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
          >
            <FormTextField<LegalGuardianBasicFormValues> name="fullName" label="Nome completo" />
            <FormTextField<LegalGuardianBasicFormValues> name="documentNumber" label="Documento" />
            <FormTextField<LegalGuardianBasicFormValues>
              name="documentType"
              label="Tipo de documento"
            />
            <FormTextField<LegalGuardianBasicFormValues> name="relationshipType" label="Vínculo" />
            <FormActions
              secondaryAction={{
                type: 'back',
                label: 'Cancelar',
                onClick: model.onBack,
                disabled: model.submitting,
              }}
              primaryAction={{
                type: 'confirm',
                label: model.isEdit ? 'Salvar alterações' : 'Cadastrar',
                onClick: () => {
                  void model.guardianForm.handleSubmit(model.submitGuardian)();
                },
                loading: model.submitting,
              }}
            />
          </AppForm>
        </AppPaper>
      )}
    </AppStack>
  );
};
