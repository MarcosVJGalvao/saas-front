import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useAcademicYearCreatePage } from '@features/client/academic/hooks/useAcademicYearCreatePage';
import type { AcademicYearCreateFormValues } from '@features/client/academic/schemas/academicYearCreateForm.schema';

const AcademicYearCreatePage = () => {
  const academicYearCreatePage = useAcademicYearCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Cadastrar ano letivo"
        subtitle="Defina período, política de boletim e dados de controle do ano letivo."
        actionLabel="Voltar"
        onAction={academicYearCreatePage.onBack}
      />
      {academicYearCreatePage.errorMessage ? (
        <AppAlert severity="error">{academicYearCreatePage.errorMessage}</AppAlert>
      ) : null}
      {academicYearCreatePage.submitting ? (
        <AppCircularProgress ariaLabel="Salvando ano letivo" />
      ) : (
        <AppPaper sx={{ p: 3 }}>
          <AppForm
            form={academicYearCreatePage.form}
            onSubmit={academicYearCreatePage.onSubmit}
            useResponsiveGrid
            columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
          >
            <AppText variant="h6">Ano letivo</AppText>
            <FormTextField<AcademicYearCreateFormValues> name="name" label="Nome" />
            <FormTextField<AcademicYearCreateFormValues>
              name="status"
              label="Status"
              placeholder="scheduled, active ou closed"
            />
            <FormTextField<AcademicYearCreateFormValues>
              name="startDate"
              label="Data inicial"
              type="date"
            />
            <FormTextField<AcademicYearCreateFormValues>
              name="endDate"
              label="Data final"
              type="date"
            />
            <FormTextField<AcademicYearCreateFormValues>
              name="description"
              label="Descrição"
              placeholder="Descrição opcional"
            />
            <AppText variant="h6">Período acadêmico inicial</AppText>
            <FormTextField<AcademicYearCreateFormValues>
              name="periodName"
              label="Nome do período"
            />
            <FormTextField<AcademicYearCreateFormValues>
              name="periodCode"
              label="Código do período"
            />
            <FormTextField<AcademicYearCreateFormValues>
              name="periodSequence"
              label="Sequência"
              placeholder="1"
            />
            <FormTextField<AcademicYearCreateFormValues>
              name="periodStartDate"
              label="Data inicial do período"
              type="date"
            />
            <FormTextField<AcademicYearCreateFormValues>
              name="periodEndDate"
              label="Data final do período"
              type="date"
            />
            <FormTextField<AcademicYearCreateFormValues>
              name="periodWeight"
              label="Peso do período"
              placeholder="1"
            />
            <FormTextField<AcademicYearCreateFormValues>
              name="periodIsFinal"
              label="Período final"
              placeholder="true ou false"
            />
            <AppText variant="h6">Política de boletim</AppText>
            <FormTextField<AcademicYearCreateFormValues>
              name="calculationType"
              label="Tipo de cálculo"
              placeholder="arithmetic ou weighted"
            />
            <FormTextField<AcademicYearCreateFormValues>
              name="passingGrade"
              label="Nota mínima"
              placeholder="6"
            />
            <FormTextField<AcademicYearCreateFormValues>
              name="minimumAttendancePercentage"
              label="Frequência mínima"
              placeholder="75"
            />
            <FormTextField<AcademicYearCreateFormValues>
              name="recoveryStrategy"
              label="Estratégia de recuperação"
              placeholder="none, replace_lowest ou replace_average"
            />
            <FormTextField<AcademicYearCreateFormValues>
              name="finalStatusStrategy"
              label="Estratégia de status final"
              placeholder="approval_or_recovery ou approval_recovery_or_failure"
            />
            <FormActions
              secondaryAction={{
                type: 'back',
                label: 'Cancelar',
                onClick: academicYearCreatePage.onBack,
                disabled: academicYearCreatePage.submitting,
              }}
              primaryAction={{
                type: 'confirm',
                label: 'Cadastrar',
                onClick: () => {
                  void academicYearCreatePage.form.handleSubmit(academicYearCreatePage.onSubmit)();
                },
                loading: academicYearCreatePage.submitting,
              }}
            />
          </AppForm>
        </AppPaper>
      )}
    </AppStack>
  );
};

export default AcademicYearCreatePage;
