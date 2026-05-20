import { useParams } from 'react-router-dom';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { gradeCatalogConfig } from '@features/client/academic/constants/academicCatalogPageConfigs';
import { useAcademicCatalogEditPage } from '@features/client/academic/hooks/useAcademicCatalogEditPage';
import type { AcademicCatalogEditFormValues } from '@features/client/academic/schemas/academicCatalogEditForm.schema';

const GradeEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const gradeEditPage = useAcademicCatalogEditPage({
    id: id ?? '',
    service: gradeCatalogConfig.service,
    backPath: gradeCatalogConfig.routeBase,
    loadErrorMessage: gradeCatalogConfig.loadErrorMessage,
    submitErrorMessage: gradeCatalogConfig.submitErrorMessage,
  });

  if (!id) {
    return null;
  }

  if (gradeEditPage.loading) {
    return <AppCircularProgress ariaLabel="Carregando série" />;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={gradeCatalogConfig.editTitle}
        subtitle={gradeCatalogConfig.editSubtitle}
        actionLabel="Voltar"
        onAction={gradeEditPage.onBack}
      />
      {gradeEditPage.errorMessage ? (
        <AppAlert severity="error">{gradeEditPage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={gradeEditPage.form}
          onSubmit={gradeEditPage.onSubmit}
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
            name="educationLevelId"
            label="Nível de ensino"
            placeholder="ID do nível de ensino"
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
              onClick: gradeEditPage.onBack,
              disabled: gradeEditPage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Salvar alterações',
              onClick: () => {
                void gradeEditPage.form.handleSubmit(gradeEditPage.onSubmit)();
              },
              loading: gradeEditPage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default GradeEditPage;
