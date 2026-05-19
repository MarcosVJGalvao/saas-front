import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useSchoolClassFormPageViewModel } from '@features/client/academic/hooks/useSchoolClassFormPageViewModel';
import type { SchoolClassFormValues } from '@features/client/academic/schemas/schoolClassFormSchema';

export const SchoolClassFormPage = () => {
  const model = useSchoolClassFormPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={model.isEdit ? 'Editar turma' : 'Cadastrar turma'}
        subtitle="Defina ano letivo, série, turno, capacidade e status da turma."
        actionLabel="Voltar"
        onAction={model.onBack}
      />
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      {model.loading ? (
        <AppCircularProgress ariaLabel="Carregando formulário" />
      ) : (
        <AppPaper sx={{ p: 3 }}>
          <AppForm
            form={model.form}
            onSubmit={model.onSubmit}
            useResponsiveGrid
            columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
          >
            <FormTextField<SchoolClassFormValues> name="name" label="Nome" />
            <FormTextField<SchoolClassFormValues> name="code" label="Código" />
            <FormTextField<SchoolClassFormValues>
              name="status"
              label="Status"
              placeholder="active, inactive ou cancelled"
            />
            <FormTextField<SchoolClassFormValues>
              name="shift"
              label="Turno"
              placeholder="morning, afternoon, evening ou full_time"
            />
            <FormTextField<SchoolClassFormValues>
              name="capacity"
              label="Capacidade"
              placeholder="Quantidade de vagas"
            />
            <FormTextField<SchoolClassFormValues>
              name="academicYearId"
              label="Ano letivo"
              placeholder="ID do ano letivo"
            />
            <FormTextField<SchoolClassFormValues>
              name="gradeId"
              label="Série"
              placeholder="ID da série"
            />
            <FormTextField<SchoolClassFormValues>
              name="educationLevelId"
              label="Nível de ensino"
              placeholder="ID do nível de ensino"
            />
            <FormTextField<SchoolClassFormValues>
              name="description"
              label="Descrição"
              placeholder="Descrição opcional"
            />
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
                  void model.form.handleSubmit(model.onSubmit)();
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
