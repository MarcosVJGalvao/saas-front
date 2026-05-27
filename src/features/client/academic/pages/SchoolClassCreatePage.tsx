import { useSchoolClassCreatePage } from '@features/client/academic/hooks/useSchoolClassCreatePage';
import type { SchoolClassCreateFormValues } from '@features/client/academic/schemas/schoolClassCreateForm.schema';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { schoolClassShiftOptions } from '@shared/constants/selectOptions';

const SchoolClassCreatePage = () => {
  const schoolClassCreatePage = useSchoolClassCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Cadastrar turma"
        subtitle="Defina os dados essenciais da turma para o cadastro."
        actionLabel="Voltar"
        onAction={schoolClassCreatePage.onBack}
      />
      {schoolClassCreatePage.errorMessage ? (
        <AppAlert severity="error">{schoolClassCreatePage.errorMessage}</AppAlert>
      ) : null}
      {schoolClassCreatePage.referenceOptions.errorMessage ? (
        <AppAlert severity="error">{schoolClassCreatePage.referenceOptions.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={schoolClassCreatePage.form}
          onSubmit={schoolClassCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<SchoolClassCreateFormValues> name="name" label="Nome" />
          <FormTextField<SchoolClassCreateFormValues> name="code" label="Código" />
          <FormSelect<SchoolClassCreateFormValues>
            name="shift"
            label="Turno"
            options={schoolClassShiftOptions}
          />
          <FormTextField<SchoolClassCreateFormValues>
            name="maxCapacity"
            label="Capacidade"
            placeholder="Quantidade de vagas"
            type="number"
          />
          <FormSelect<SchoolClassCreateFormValues>
            name="academicYearId"
            label="Ano letivo"
            options={schoolClassCreatePage.referenceOptions.academicYearOptions}
            disabled={schoolClassCreatePage.referenceOptions.loading}
          />
          <FormSelect<SchoolClassCreateFormValues>
            name="gradeId"
            label="Série"
            options={schoolClassCreatePage.referenceOptions.gradeOptions}
            disabled={schoolClassCreatePage.referenceOptions.loading}
          />
          <FormSelect<SchoolClassCreateFormValues>
            name="coordinatorId"
            label="Coordenador"
            options={schoolClassCreatePage.referenceOptions.teacherOptions}
            disabled={schoolClassCreatePage.referenceOptions.loading}
          />
          <FormTextField<SchoolClassCreateFormValues>
            name="description"
            label="Descrição"
            placeholder="Descrição opcional"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: schoolClassCreatePage.onBack,
              disabled: schoolClassCreatePage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void schoolClassCreatePage.form.handleSubmit(schoolClassCreatePage.onSubmit)();
              },
              loading: schoolClassCreatePage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default SchoolClassCreatePage;
