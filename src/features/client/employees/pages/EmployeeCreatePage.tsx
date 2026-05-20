import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useEmployeeCreatePage } from '@features/client/employees/hooks/useEmployeeCreatePage';
import type { EmployeeCreateFormValues } from '@features/client/employees/schemas/employeeCreateForm.schema';

const EmployeeCreatePage = () => {
  const employeeCreatePage = useEmployeeCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Cadastrar funcionário"
        subtitle="Informe cargo, departamento e pessoa vinculada."
        actionLabel="Voltar"
        onAction={() => {
          employeeCreatePage.onBack();
        }}
      />
      {employeeCreatePage.errorMessage ? (
        <AppAlert severity="error">{employeeCreatePage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={employeeCreatePage.form}
          onSubmit={employeeCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<EmployeeCreateFormValues>
            name="personId"
            label="Pessoa existente"
            placeholder="ID da pessoa, se já existir"
          />
          <FormTextField<EmployeeCreateFormValues>
            name="fullName"
            label="Nome completo"
            placeholder="Use quando não houver pessoa existente"
          />
          <FormTextField<EmployeeCreateFormValues> name="documentNumber" label="Documento" />
          <FormTextField<EmployeeCreateFormValues>
            name="jobTitle"
            label="Cargo"
            placeholder="Professor, coordenador ou administrativo"
          />
          <FormTextField<EmployeeCreateFormValues> name="department" label="Departamento" />
          <FormTextField<EmployeeCreateFormValues>
            name="status"
            label="Status"
            placeholder="active ou inactive"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: () => {
                employeeCreatePage.onBack();
              },
              disabled: employeeCreatePage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void employeeCreatePage.form.handleSubmit(employeeCreatePage.onSubmit)();
              },
              loading: employeeCreatePage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default EmployeeCreatePage;
