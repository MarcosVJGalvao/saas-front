import { useLocation, useParams } from 'react-router-dom';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useAcademicYearEditPage } from '@features/client/academic/hooks/useAcademicYearEditPage';
import type { AcademicYearEditFormValues } from '@features/client/academic/schemas/academicYearEditForm.schema';

const AcademicYearEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const academicYearEditPage = useAcademicYearEditPage(id ?? '', location.state);

  if (!id) {
    return null;
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Editar ano letivo"
        subtitle="Defina período, política de boletim e dados de controle do ano letivo."
        actionLabel="Voltar"
        onAction={academicYearEditPage.onBack}
      />
      {academicYearEditPage.errorMessage ? (
        <AppAlert severity="error">{academicYearEditPage.errorMessage}</AppAlert>
      ) : null}
      {academicYearEditPage.loading ? (
        <AppCircularProgress ariaLabel="Carregando formulário" />
      ) : (
        <AppPaper sx={{ p: 3 }}>
          <AppForm
            form={academicYearEditPage.form}
            onSubmit={academicYearEditPage.onSubmit}
            useResponsiveGrid
            columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
          >
            <AppText variant="h6">Ano letivo</AppText>
            <FormTextField<AcademicYearEditFormValues> name="name" label="Nome" />
            <FormTextField<AcademicYearEditFormValues>
              name="status"
              label="Status"
              placeholder="scheduled, active ou closed"
            />
            <FormTextField<AcademicYearEditFormValues>
              name="startDate"
              label="Data inicial"
              type="date"
            />
            <FormTextField<AcademicYearEditFormValues>
              name="endDate"
              label="Data final"
              type="date"
            />
            <FormTextField<AcademicYearEditFormValues>
              name="description"
              label="Descrição"
              placeholder="Descrição opcional"
            />
            <AppText variant="h6">Período acadêmico inicial</AppText>
            <FormTextField<AcademicYearEditFormValues> name="periodName" label="Nome do período" />
            <FormTextField<AcademicYearEditFormValues>
              name="periodCode"
              label="Código do período"
            />
            <FormTextField<AcademicYearEditFormValues>
              name="periodSequence"
              label="Sequência"
              placeholder="1"
            />
            <FormTextField<AcademicYearEditFormValues>
              name="periodStartDate"
              label="Data inicial do período"
              type="date"
            />
            <FormTextField<AcademicYearEditFormValues>
              name="periodEndDate"
              label="Data final do período"
              type="date"
            />
            <FormTextField<AcademicYearEditFormValues>
              name="periodWeight"
              label="Peso do período"
              placeholder="1"
            />
            <FormTextField<AcademicYearEditFormValues>
              name="periodIsFinal"
              label="Período final"
              placeholder="true ou false"
            />
            <AppText variant="h6">Política de boletim</AppText>
            <FormTextField<AcademicYearEditFormValues>
              name="calculationType"
              label="Tipo de cálculo"
              placeholder="arithmetic ou weighted"
            />
            <FormTextField<AcademicYearEditFormValues>
              name="passingGrade"
              label="Nota mínima"
              placeholder="6"
            />
            <FormTextField<AcademicYearEditFormValues>
              name="minimumAttendancePercentage"
              label="Frequência mínima"
              placeholder="75"
            />
            <FormTextField<AcademicYearEditFormValues>
              name="recoveryStrategy"
              label="Estratégia de recuperação"
              placeholder="none, replace_lowest ou replace_average"
            />
            <FormTextField<AcademicYearEditFormValues>
              name="finalStatusStrategy"
              label="Estratégia de status final"
              placeholder="approval_or_recovery ou approval_recovery_or_failure"
            />
            <FormActions
              secondaryAction={{
                type: 'back',
                label: 'Cancelar',
                onClick: academicYearEditPage.onBack,
                disabled: academicYearEditPage.submitting,
              }}
              primaryAction={{
                type: 'confirm',
                label: 'Salvar alterações',
                onClick: () => {
                  void academicYearEditPage.form.handleSubmit(academicYearEditPage.onSubmit)();
                },
                loading: academicYearEditPage.submitting,
              }}
            />
          </AppForm>
        </AppPaper>
      )}
    </AppStack>
  );
};

export default AcademicYearEditPage;
