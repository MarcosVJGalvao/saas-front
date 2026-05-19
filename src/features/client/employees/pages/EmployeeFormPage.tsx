import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useEmployeeFormPageViewModel } from '@features/client/employees/hooks/useEmployeeFormPageViewModel';
import type { EmployeeFormValues } from '@features/client/employees/schemas/employeeFormSchema';

const EmployeeFormPage = () => {
  const model = useEmployeeFormPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={model.isEdit ? 'Editar funcionário' : 'Cadastrar funcionário'}
        subtitle="Informe cargo, departamento e pessoa vinculada."
        actionLabel="Voltar"
        onAction={model.onBack}
      />
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      {model.loading ? (
        <AppCircularProgress ariaLabel="Carregando funcionário" />
      ) : (
        <AppPaper sx={{ p: 3 }}>
          <AppForm
            form={model.form}
            onSubmit={model.onSubmit}
            useResponsiveGrid
            columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
          >
            <FormTextField<EmployeeFormValues>
              name="personId"
              label="Pessoa existente"
              placeholder="ID da pessoa, se já existir"
            />
            <FormTextField<EmployeeFormValues>
              name="fullName"
              label="Nome completo"
              placeholder="Use quando não houver pessoa existente"
            />
            <FormTextField<EmployeeFormValues> name="documentNumber" label="Documento" />
            <FormTextField<EmployeeFormValues>
              name="jobTitle"
              label="Cargo"
              placeholder="Professor, coordenador ou administrativo"
            />
            <FormTextField<EmployeeFormValues> name="department" label="Departamento" />
            <FormTextField<EmployeeFormValues>
              name="status"
              label="Status"
              placeholder="active ou inactive"
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

export default EmployeeFormPage;
