import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { subjectCatalogConfig } from '@features/client/academic/constants/academicCatalogPageConfigs';
import { useAcademicCatalogCreatePage } from '@features/client/academic/hooks/useAcademicCatalogCreatePage';
import type { AcademicCatalogCreateFormValues } from '@features/client/academic/schemas/academicCatalogCreateForm.schema';

const SubjectCreatePage = () => {
  const subjectCreatePage = useAcademicCatalogCreatePage({
    service: subjectCatalogConfig.service,
    backPath: subjectCatalogConfig.routeBase,
    submitErrorMessage: subjectCatalogConfig.submitErrorMessage,
  });

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={subjectCatalogConfig.createTitle}
        subtitle={subjectCatalogConfig.createSubtitle}
        actionLabel="Voltar"
        onAction={subjectCreatePage.onBack}
      />
      {subjectCreatePage.errorMessage ? (
        <AppAlert severity="error">{subjectCreatePage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={subjectCreatePage.form}
          onSubmit={subjectCreatePage.onSubmit}
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
            name="description"
            label="Descrição"
            placeholder="Descrição opcional"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: subjectCreatePage.onBack,
              disabled: subjectCreatePage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void subjectCreatePage.form.handleSubmit(subjectCreatePage.onSubmit)();
              },
              loading: subjectCreatePage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default SubjectCreatePage;
