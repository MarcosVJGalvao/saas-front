import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useFinancialRecordFormPageViewModel } from '@features/client/financial/hooks/useFinancialRecordFormPageViewModel';
import type { FinancialRecordFormValues } from '@features/client/financial/schemas/financialRecordFormSchema';
import type {
  FinancialRecord,
  FinancialRecordPayload,
} from '@features/client/financial/types/financial.types';

type FinancialRecordFormService = {
  getById: (id: string) => Promise<FinancialRecord>;
  create: (payload: FinancialRecordPayload) => Promise<FinancialRecord>;
  update: (id: string, payload: FinancialRecordPayload) => Promise<FinancialRecord>;
};

type FinancialRecordFormPageProps = {
  title: string;
  editTitle: string;
  subtitle: string;
  backPath: string;
  service: FinancialRecordFormService;
  loadErrorMessage: string;
  submitErrorMessage: string;
  includeStudent?: boolean | undefined;
};

export const FinancialRecordFormPage = ({
  title,
  editTitle,
  subtitle,
  backPath,
  service,
  loadErrorMessage,
  submitErrorMessage,
  includeStudent = false,
}: FinancialRecordFormPageProps) => {
  const model = useFinancialRecordFormPageViewModel({
    service,
    backPath,
    includeStudent,
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
            <FormTextField<FinancialRecordFormValues> name="description" label="Descrição" />
            <FormTextField<FinancialRecordFormValues>
              name="amount"
              label="Valor"
              placeholder="R$ 0,00"
            />
            <FormTextField<FinancialRecordFormValues>
              name="dueDate"
              label="Vencimento"
              type="date"
            />
            <FormTextField<FinancialRecordFormValues>
              name="status"
              label="Status"
              placeholder="open, paid, received..."
            />
            <FormTextField<FinancialRecordFormValues>
              name="categoryId"
              label="Categoria"
              placeholder="ID da categoria"
            />
            <FormTextField<FinancialRecordFormValues>
              name="costCenterId"
              label="Centro de custo"
              placeholder="ID do centro de custo"
            />
            {includeStudent ? (
              <FormTextField<FinancialRecordFormValues>
                name="studentId"
                label="Aluno"
                placeholder="ID do aluno"
              />
            ) : null}
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
