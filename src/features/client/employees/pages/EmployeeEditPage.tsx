import { useParams } from 'react-router-dom';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppTextField } from '@shared/components/inputs/AppTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { activeInactiveStatusOptions } from '@shared/constants/selectOptions';
import { useEmployeeEditPage } from '@features/client/employees/hooks/useEmployeeEditPage';
import type { EmployeeEditFormValues } from '@features/client/employees/schemas/employeeEditForm.schema';

const EmployeeEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const employeeEditPage = useEmployeeEditPage(id ?? '');

  if (!id) {
    return null;
  }

  if (employeeEditPage.loading) {
    return <AppCircularProgress ariaLabel="Carregando funcionário" />;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Editar funcionário"
        subtitle="Atualize cargo, departamento e status."
        actionLabel="Voltar"
        onAction={() => {
          employeeEditPage.onBack();
        }}
      />
      {employeeEditPage.errorMessage ? (
        <AppAlert severity="error">{employeeEditPage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppStack spacing={2}>
          <AppTextField
            label="Nome completo"
            value={employeeEditPage.employee?.person?.fullName ?? ''}
            disabled
          />
          <AppTextField
            label="Documento"
            value={employeeEditPage.employee?.person?.documentNumber ?? ''}
            disabled
          />
        </AppStack>
        <AppForm
          form={employeeEditPage.form}
          onSubmit={employeeEditPage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<EmployeeEditFormValues> name="jobTitle" label="Cargo" />
          <FormTextField<EmployeeEditFormValues> name="department" label="Departamento" />
          <FormSelect<EmployeeEditFormValues>
            name="status"
            label="Status"
            options={activeInactiveStatusOptions}
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: () => {
                employeeEditPage.onBack();
              },
              disabled: employeeEditPage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Salvar alterações',
              onClick: () => {
                void employeeEditPage.form.handleSubmit(employeeEditPage.onSubmit)();
              },
              loading: employeeEditPage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default EmployeeEditPage;
