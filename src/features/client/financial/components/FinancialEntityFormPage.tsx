import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useFinancialEntityFormPageViewModel } from '@features/client/financial/hooks/useFinancialEntityFormPageViewModel';
import type { FinancialEntityFormValues } from '@features/client/financial/schemas/financialEntityFormSchema';
import type {
  FinancialEntity,
  FinancialEntityPayload,
} from '@features/client/financial/types/financial.types';

type FinancialEntityFormService = {
  getById: (id: string) => Promise<FinancialEntity>;
  create: (payload: FinancialEntityPayload) => Promise<FinancialEntity>;
  update: (id: string, payload: FinancialEntityPayload) => Promise<FinancialEntity>;
};

type FinancialEntityFormPageProps = {
  title: string;
  editTitle: string;
  subtitle: string;
  backPath: string;
  service: FinancialEntityFormService;
  loadErrorMessage: string;
  submitErrorMessage: string;
  includeType?: boolean | undefined;
};

export const FinancialEntityFormPage = ({
  title,
  editTitle,
  subtitle,
  backPath,
  service,
  loadErrorMessage,
  submitErrorMessage,
  includeType = false,
}: FinancialEntityFormPageProps) => {
  const model = useFinancialEntityFormPageViewModel({
    service,
    backPath,
    includeType,
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
            <FormTextField<FinancialEntityFormValues> name="name" label="Nome" />
            <FormTextField<FinancialEntityFormValues> name="code" label="Código" />
            {includeType ? (
              <FormTextField<FinancialEntityFormValues>
                name="type"
                label="Tipo"
                placeholder="revenue ou expense"
              />
            ) : null}
            <FormTextField<FinancialEntityFormValues>
              name="status"
              label="Status"
              placeholder="active ou inactive"
            />
            <FormTextField<FinancialEntityFormValues>
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
