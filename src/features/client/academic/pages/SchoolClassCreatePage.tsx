import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useSchoolClassCreatePage } from '@features/client/academic/hooks/useSchoolClassCreatePage';
import type { SchoolClassCreateFormValues } from '@features/client/academic/schemas/schoolClassCreateForm.schema';

const SchoolClassCreatePage = () => {
  const schoolClassCreatePage = useSchoolClassCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Cadastrar turma"
        subtitle="Defina ano letivo, série, turno, capacidade e status da turma."
        actionLabel="Voltar"
        onAction={schoolClassCreatePage.onBack}
      />
      {schoolClassCreatePage.errorMessage ? (
        <AppAlert severity="error">{schoolClassCreatePage.errorMessage}</AppAlert>
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
          <FormTextField<SchoolClassCreateFormValues>
            name="status"
            label="Status"
            placeholder="active, inactive ou cancelled"
          />
          <FormTextField<SchoolClassCreateFormValues>
            name="shift"
            label="Turno"
            placeholder="morning, afternoon, evening ou full_time"
          />
          <FormTextField<SchoolClassCreateFormValues>
            name="capacity"
            label="Capacidade"
            placeholder="Quantidade de vagas"
          />
          <FormTextField<SchoolClassCreateFormValues>
            name="academicYearId"
            label="Ano letivo"
            placeholder="ID do ano letivo"
          />
          <FormTextField<SchoolClassCreateFormValues>
            name="gradeId"
            label="Série"
            placeholder="ID da série"
          />
          <FormTextField<SchoolClassCreateFormValues>
            name="educationLevelId"
            label="Nível de ensino"
            placeholder="ID do nível de ensino"
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
