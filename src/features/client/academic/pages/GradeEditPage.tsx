import { useParams } from 'react-router-dom';
import { gradeCatalogConfig } from '@features/client/academic/constants/academicCatalogPageConfigs';
import { useAcademicReferenceOptions } from '@features/client/academic/hooks/useAcademicReferenceOptions';
import { useAcademicCatalogEditPage } from '@features/client/academic/hooks/useAcademicCatalogEditPage';
import type { AcademicCatalogEditFormValues } from '@features/client/academic/schemas/academicCatalogEditForm.schema';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormSelect } from '@shared/components/form/FormSelect';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { activeInactiveStatusOptions } from '@shared/constants/selectOptions';

const GradeEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const gradeEditPage = useAcademicCatalogEditPage({
    id: id ?? '',
    service: gradeCatalogConfig.service,
    backPath: gradeCatalogConfig.routeBase,
    loadErrorMessage: gradeCatalogConfig.loadErrorMessage,
    submitErrorMessage: gradeCatalogConfig.submitErrorMessage,
  });
  const referenceOptions = useAcademicReferenceOptions({ includeEducationLevels: true });

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
      {referenceOptions.errorMessage ? (
        <AppAlert severity="error">{referenceOptions.errorMessage}</AppAlert>
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
          <FormSelect<AcademicCatalogEditFormValues>
            name="status"
            label="Status"
            options={activeInactiveStatusOptions}
          />
          <FormSelect<AcademicCatalogEditFormValues>
            name="educationLevelId"
            label="Nível de ensino"
            options={referenceOptions.educationLevelOptions}
            disabled={referenceOptions.loading}
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
