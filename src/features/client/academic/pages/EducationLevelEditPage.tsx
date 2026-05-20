import { useParams } from 'react-router-dom';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { educationLevelCatalogConfig } from '@features/client/academic/constants/academicCatalogPageConfigs';
import { useAcademicCatalogEditPage } from '@features/client/academic/hooks/useAcademicCatalogEditPage';
import type { AcademicCatalogEditFormValues } from '@features/client/academic/schemas/academicCatalogEditForm.schema';

const EducationLevelEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const educationLevelEditPage = useAcademicCatalogEditPage({
    id: id ?? '',
    service: educationLevelCatalogConfig.service,
    backPath: educationLevelCatalogConfig.routeBase,
    loadErrorMessage: educationLevelCatalogConfig.loadErrorMessage,
    submitErrorMessage: educationLevelCatalogConfig.submitErrorMessage,
  });

  if (!id) {
    return null;
  }

  if (educationLevelEditPage.loading) {
    return <AppCircularProgress ariaLabel="Carregando nível de ensino" />;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={educationLevelCatalogConfig.editTitle}
        subtitle={educationLevelCatalogConfig.editSubtitle}
        actionLabel="Voltar"
        onAction={educationLevelEditPage.onBack}
      />
      {educationLevelEditPage.errorMessage ? (
        <AppAlert severity="error">{educationLevelEditPage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={educationLevelEditPage.form}
          onSubmit={educationLevelEditPage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<AcademicCatalogEditFormValues> name="name" label="Nome" />
          <FormTextField<AcademicCatalogEditFormValues> name="code" label="Código" />
          <FormTextField<AcademicCatalogEditFormValues>
            name="status"
            label="Status"
            placeholder="active ou inactive"
          />
          <FormTextField<AcademicCatalogEditFormValues>
            name="description"
            label="Descrição"
            placeholder="Descrição opcional"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: educationLevelEditPage.onBack,
              disabled: educationLevelEditPage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Salvar alterações',
              onClick: () => {
                void educationLevelEditPage.form.handleSubmit(educationLevelEditPage.onSubmit)();
              },
              loading: educationLevelEditPage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default EducationLevelEditPage;
