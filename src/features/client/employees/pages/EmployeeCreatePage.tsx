import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { EmployeeCreateFormFields } from '@features/client/employees/components/EmployeeCreateFormFields';
import { useEmployeeCreatePage } from '@features/client/employees/hooks/useEmployeeCreatePage';

const EmployeeCreatePage = () => {
  const employeeCreatePage = useEmployeeCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Cadastrar funcionário"
        subtitle="Escolha entre vincular uma pessoa existente ou cadastrar a pessoa completa."
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
          columnsByDevice={{ mobile: 1, tablet: 1, desktop: 1 }}
        >
          <EmployeeCreateFormFields
            form={employeeCreatePage.form}
            addressLookupLoading={employeeCreatePage.addressLookupLoading}
            onSearchCep={() => {
              void employeeCreatePage.onSearchCep();
            }}
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
