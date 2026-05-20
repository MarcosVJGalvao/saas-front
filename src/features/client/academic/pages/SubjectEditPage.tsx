import { useParams } from 'react-router-dom';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { subjectCatalogConfig } from '@features/client/academic/constants/academicCatalogPageConfigs';
import { useAcademicCatalogEditPage } from '@features/client/academic/hooks/useAcademicCatalogEditPage';
import type { AcademicCatalogEditFormValues } from '@features/client/academic/schemas/academicCatalogEditForm.schema';

const SubjectEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const subjectEditPage = useAcademicCatalogEditPage({
    id: id ?? '',
    service: subjectCatalogConfig.service,
    backPath: subjectCatalogConfig.routeBase,
    loadErrorMessage: subjectCatalogConfig.loadErrorMessage,
    submitErrorMessage: subjectCatalogConfig.submitErrorMessage,
  });

  if (!id) {
    return null;
  }

  if (subjectEditPage.loading) {
    return <AppCircularProgress ariaLabel="Carregando disciplina" />;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={subjectCatalogConfig.editTitle}
        subtitle={subjectCatalogConfig.editSubtitle}
        actionLabel="Voltar"
        onAction={subjectEditPage.onBack}
      />
      {subjectEditPage.errorMessage ? (
        <AppAlert severity="error">{subjectEditPage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={subjectEditPage.form}
          onSubmit={subjectEditPage.onSubmit}
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
              onClick: subjectEditPage.onBack,
              disabled: subjectEditPage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Salvar alterações',
              onClick: () => {
                void subjectEditPage.form.handleSubmit(subjectEditPage.onSubmit)();
              },
              loading: subjectEditPage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default SubjectEditPage;
