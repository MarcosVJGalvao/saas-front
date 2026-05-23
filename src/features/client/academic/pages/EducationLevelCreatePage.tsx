import { educationLevelCatalogConfig } from '@features/client/academic/constants/academicCatalogPageConfigs';
import { useAcademicCatalogCreatePage } from '@features/client/academic/hooks/useAcademicCatalogCreatePage';
import { toEducationLevelCreatePayload } from '@features/client/academic/normalizers/academicCatalogFormNormalizer';
import type { AcademicCatalogCreateFormValues } from '@features/client/academic/schemas/academicCatalogCreateForm.schema';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';

const EducationLevelCreatePage = () => {
  const educationLevelCreatePage = useAcademicCatalogCreatePage({
    service: educationLevelCatalogConfig.service,
    backPath: educationLevelCatalogConfig.routeBase,
    submitErrorMessage: educationLevelCatalogConfig.submitErrorMessage,
    buildPayload: toEducationLevelCreatePayload,
  });

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={educationLevelCatalogConfig.createTitle}
        subtitle={educationLevelCatalogConfig.createSubtitle}
        actionLabel="Voltar"
        onAction={educationLevelCreatePage.onBack}
      />
      {educationLevelCreatePage.errorMessage ? (
        <AppAlert severity="error">{educationLevelCreatePage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={educationLevelCreatePage.form}
          onSubmit={educationLevelCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<AcademicCatalogCreateFormValues> name="name" label="Nome" />
          <FormTextField<AcademicCatalogCreateFormValues>
            name="description"
            label="Descrição"
            placeholder="Descrição opcional"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: educationLevelCreatePage.onBack,
              disabled: educationLevelCreatePage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void educationLevelCreatePage.form.handleSubmit(
                  educationLevelCreatePage.onSubmit,
                )();
              },
              loading: educationLevelCreatePage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default EducationLevelCreatePage;
