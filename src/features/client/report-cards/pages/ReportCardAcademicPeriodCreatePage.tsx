import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppForm } from '@shared/components/form/AppForm';
import { FormActions } from '@shared/components/form/FormActions';
import { FormTextField } from '@shared/components/form/FormTextField';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useReportCardAcademicPeriodCreatePage } from '@features/client/report-cards/hooks/useReportCardAcademicPeriodCreatePage';
import type { ReportCardAcademicPeriodCreateFormValues } from '@features/client/report-cards/schemas/reportCardAcademicPeriodCreateForm.schema';

const ReportCardAcademicPeriodCreatePage = () => {
  const reportCardAcademicPeriodCreatePage = useReportCardAcademicPeriodCreatePage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Novo período do boletim"
        subtitle="Cadastre o período acadêmico usado nos lançamentos e fechamentos do boletim."
        actionLabel="Voltar"
        onAction={reportCardAcademicPeriodCreatePage.onBack}
      />
      {reportCardAcademicPeriodCreatePage.errorMessage ? (
        <AppAlert severity="error">{reportCardAcademicPeriodCreatePage.errorMessage}</AppAlert>
      ) : null}
      <AppPaper sx={{ p: 3 }}>
        <AppForm
          form={reportCardAcademicPeriodCreatePage.form}
          onSubmit={reportCardAcademicPeriodCreatePage.onSubmit}
          useResponsiveGrid
          columnsByDevice={{ mobile: 1, tablet: 2, desktop: 2 }}
        >
          <FormTextField<ReportCardAcademicPeriodCreateFormValues>
            name="academicYearId"
            label="Ano letivo"
            placeholder="ID do ano letivo"
          />
          <FormTextField<ReportCardAcademicPeriodCreateFormValues> name="name" label="Nome" />
          <FormTextField<ReportCardAcademicPeriodCreateFormValues> name="code" label="Código" />
          <FormTextField<ReportCardAcademicPeriodCreateFormValues>
            name="sequence"
            label="Sequência"
            placeholder="1"
          />
          <FormTextField<ReportCardAcademicPeriodCreateFormValues>
            name="startDate"
            label="Data inicial"
            type="date"
          />
          <FormTextField<ReportCardAcademicPeriodCreateFormValues>
            name="endDate"
            label="Data final"
            type="date"
          />
          <FormTextField<ReportCardAcademicPeriodCreateFormValues>
            name="weight"
            label="Peso"
            placeholder="1"
          />
          <FormTextField<ReportCardAcademicPeriodCreateFormValues>
            name="isFinalPeriod"
            label="Período final"
            placeholder="true ou false"
          />
          <FormActions
            secondaryAction={{
              type: 'back',
              label: 'Cancelar',
              onClick: reportCardAcademicPeriodCreatePage.onBack,
              disabled: reportCardAcademicPeriodCreatePage.submitting,
            }}
            primaryAction={{
              type: 'confirm',
              label: 'Cadastrar',
              onClick: () => {
                void reportCardAcademicPeriodCreatePage.form.handleSubmit(
                  reportCardAcademicPeriodCreatePage.onSubmit,
                )();
              },
              loading: reportCardAcademicPeriodCreatePage.submitting,
            }}
          />
        </AppForm>
      </AppPaper>
    </AppStack>
  );
};

export default ReportCardAcademicPeriodCreatePage;
