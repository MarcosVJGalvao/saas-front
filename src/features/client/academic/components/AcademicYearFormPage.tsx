import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useAcademicYearFormPageViewModel } from '@features/client/academic/hooks/useAcademicYearFormPageViewModel';
import type { AcademicYearFormValues } from '@features/client/academic/schemas/academicYearFormSchema';

export const AcademicYearFormPage = () => {
  const model = useAcademicYearFormPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={model.isEdit ? 'Editar ano letivo' : 'Cadastrar ano letivo'}
        subtitle="Defina período, política de boletim e dados de controle do ano letivo."
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
            <AppText variant="h6">Ano letivo</AppText>
            <FormTextField<AcademicYearFormValues> name="name" label="Nome" />
            <FormTextField<AcademicYearFormValues>
              name="status"
              label="Status"
              placeholder="scheduled, active ou closed"
            />
            <FormTextField<AcademicYearFormValues>
              name="startDate"
              label="Data inicial"
              type="date"
            />
            <FormTextField<AcademicYearFormValues> name="endDate" label="Data final" type="date" />
            <FormTextField<AcademicYearFormValues>
              name="description"
              label="Descrição"
              placeholder="Descrição opcional"
            />
            <AppText variant="h6">Período acadêmico inicial</AppText>
            <FormTextField<AcademicYearFormValues> name="periodName" label="Nome do período" />
            <FormTextField<AcademicYearFormValues> name="periodCode" label="Código do período" />
            <FormTextField<AcademicYearFormValues>
              name="periodSequence"
              label="Sequência"
              placeholder="1"
            />
            <FormTextField<AcademicYearFormValues>
              name="periodStartDate"
              label="Data inicial do período"
              type="date"
            />
            <FormTextField<AcademicYearFormValues>
              name="periodEndDate"
              label="Data final do período"
              type="date"
            />
            <FormTextField<AcademicYearFormValues>
              name="periodWeight"
              label="Peso do período"
              placeholder="1"
            />
            <FormTextField<AcademicYearFormValues>
              name="periodIsFinal"
              label="Período final"
              placeholder="true ou false"
            />
            <AppText variant="h6">Política de boletim</AppText>
            <FormTextField<AcademicYearFormValues>
              name="calculationType"
              label="Tipo de cálculo"
              placeholder="arithmetic ou weighted"
            />
            <FormTextField<AcademicYearFormValues>
              name="passingGrade"
              label="Nota mínima"
              placeholder="6"
            />
            <FormTextField<AcademicYearFormValues>
              name="minimumAttendancePercentage"
              label="Frequência mínima"
              placeholder="75"
            />
            <FormTextField<AcademicYearFormValues>
              name="recoveryStrategy"
              label="Estratégia de recuperação"
              placeholder="none, replace_lowest ou replace_average"
            />
            <FormTextField<AcademicYearFormValues>
              name="finalStatusStrategy"
              label="Estratégia de status final"
              placeholder="approval_or_recovery ou approval_recovery_or_failure"
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
