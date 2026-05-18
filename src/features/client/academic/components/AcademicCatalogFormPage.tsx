import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useAcademicCatalogFormPageViewModel } from '@features/client/academic/hooks/useAcademicCatalogFormPageViewModel';
import type { AcademicCatalogFormValues } from '@features/client/academic/schemas/academicCatalogFormSchema';
import type { AcademicCatalogItem } from '@features/client/academic/types/academic.types';

type AcademicCatalogFormService = {
  getById: (id: string) => Promise<AcademicCatalogItem>;
  create: (payload: Record<string, unknown>) => Promise<AcademicCatalogItem>;
  update: (id: string, payload: Record<string, unknown>) => Promise<AcademicCatalogItem>;
};

type AcademicCatalogFormPageProps = {
  title: string;
  editTitle: string;
  subtitle: string;
  backPath: string;
  service: AcademicCatalogFormService;
  loadErrorMessage: string;
  submitErrorMessage: string;
  showEducationLevel?: boolean | undefined;
};

export const AcademicCatalogFormPage = ({
  title,
  editTitle,
  subtitle,
  backPath,
  service,
  loadErrorMessage,
  submitErrorMessage,
  showEducationLevel = false,
}: AcademicCatalogFormPageProps) => {
  const model = useAcademicCatalogFormPageViewModel({
    service,
    backPath,
    loadErrorMessage,
    submitErrorMessage,
  });

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={model.isEdit ? editTitle : title}
        subtitle={subtitle}
        actionLabel="Voltar"
        onAction={model.onBack}
      />
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      {model.loading ? (
        <AppCircularProgress ariaLabel="Carregando formulário" />
      ) : (
        <AppPaper sx={{ p: 3 }}>
          <AppForm
            form={model.form}
            onSubmit={model.onSubmit}
            useResponsiveGrid
            columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
          >
            <FormTextField<AcademicCatalogFormValues> name="name" label="Nome" />
            <FormTextField<AcademicCatalogFormValues> name="code" label="Código" />
            <FormTextField<AcademicCatalogFormValues>
              name="status"
              label="Status"
              placeholder="active ou inactive"
            />
            {showEducationLevel ? (
              <FormTextField<AcademicCatalogFormValues>
                name="educationLevelId"
                label="Nível de ensino"
                placeholder="ID do nível de ensino"
              />
            ) : null}
            <FormTextField<AcademicCatalogFormValues>
              name="description"
              label="Descrição"
              placeholder="Descrição opcional"
            />
            <FormActions
              secondaryAction={{
                type: 'back',
                label: 'Cancelar',
                onClick: model.onBack,
                disabled: model.submitting,
              }}
              primaryAction={{
                type: 'confirm',
                label: model.isEdit ? 'Salvar alterações' : 'Cadastrar',
                onClick: () => {
                  void model.form.handleSubmit(model.onSubmit)();
                },
                loading: model.submitting,
              }}
            />
          </AppForm>
        </AppPaper>
      )}
    </AppStack>
  );
};
