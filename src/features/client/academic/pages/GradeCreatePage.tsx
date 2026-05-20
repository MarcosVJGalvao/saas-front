import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { gradeCatalogConfig } from '@features/client/academic/constants/academicCatalogPageConfigs';
import { useAcademicCatalogCreatePage } from '@features/client/academic/hooks/useAcademicCatalogCreatePage';
import type { AcademicCatalogCreateFormValues } from '@features/client/academic/schemas/academicCatalogCreateForm.schema';

const GradeCreatePage = () => {
  const gradeCreatePage = useAcademicCatalogCreatePage({
    service: gradeCatalogConfig.service,
    backPath: gradeCatalogConfig.routeBase,
    submitErrorMessage: gradeCatalogConfig.submitErrorMessage,
  });

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={gradeCatalogConfig.createTitle}
        subtitle={gradeCatalogConfig.createSubtitle}
        actionLabel="Voltar"
        onAction={gradeCreatePage.onBack}
      />
      {gradeCreatePage.errorMessage ? (
        <AppAlert severity="error">{gradeCreatePage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={gradeCreatePage.form}
          onSubmit={gradeCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<AcademicCatalogCreateFormValues> name="name" label="Nome" />
          <FormTextField<AcademicCatalogCreateFormValues> name="code" label="Código" />
          <FormTextField<AcademicCatalogCreateFormValues>
            name="status"
            label="Status"
            placeholder="active ou inactive"
          />
          <FormTextField<AcademicCatalogCreateFormValues>
            name="educationLevelId"
            label="Nível de ensino"
            placeholder="ID do nível de ensino"
          />
          <FormTextField<AcademicCatalogCreateFormValues>
            name="description"
            label="Descrição"
            placeholder="Descrição opcional"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: gradeCreatePage.onBack,
              disabled: gradeCreatePage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void gradeCreatePage.form.handleSubmit(gradeCreatePage.onSubmit)();
              },
              loading: gradeCreatePage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default GradeCreatePage;
